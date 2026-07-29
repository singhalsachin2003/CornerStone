import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * The daily study reminder.
 *
 * The Profile toggle used to persist a boolean and do nothing. This schedules a real
 * repeating local notification at REMINDER_HOUR:REMINDER_MINUTE — the time the design
 * copy promises ("19:30 — after work, before dinner").
 *
 * Everything here fails soft: a candidate who declines the OS permission still gets a
 * working app, just without the nudge.
 */

export const REMINDER_HOUR = 19;
export const REMINDER_MINUTE = 30;

const CHANNEL_ID = 'daily-reminder';
/** Stable identifier so re-scheduling replaces rather than stacks. */
const IDENTIFIER = 'cornerstone-daily-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily study reminder',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
    vibrationPattern: null,
    enableVibrate: false,
  });
}

/** Returns true if the OS granted permission. Never throws. */
export async function requestReminderPermission(): Promise<boolean> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    if (!existing.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

/**
 * Schedule (or re-schedule) the daily reminder. Returns false if it could not be
 * scheduled, so the caller can leave the toggle off rather than lie to the user.
 */
export async function scheduleDailyReminder(): Promise<boolean> {
  try {
    const granted = await requestReminderPermission();
    if (!granted) return false;

    await ensureChannel();
    await cancelDailyReminder();

    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIER,
      content: {
        title: 'Fifteen minutes?',
        body: 'One topic, one snapshot set, five questions. That keeps the streak.',
        ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER);
  } catch {
    // Nothing scheduled under that identifier — nothing to undo.
  }
}

/**
 * Reconcile the OS schedule with the persisted setting. Called on launch, because a
 * reinstall or an OS-level permission revocation can leave the two disagreeing.
 */
export async function syncDailyReminder(enabled: boolean): Promise<boolean> {
  if (!enabled) {
    await cancelDailyReminder();
    return false;
  }
  try {
    const perms = await Notifications.getPermissionsAsync();
    if (!perms.granted) return false; // revoked in Settings — reflect reality
    await ensureChannel();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    if (scheduled.some((n) => n.identifier === IDENTIFIER)) return true;
    return await scheduleDailyReminder();
  } catch {
    return false;
  }
}

export function reminderTimeLabel(): string {
  return `${String(REMINDER_HOUR).padStart(2, '0')}:${String(REMINDER_MINUTE).padStart(2, '0')}`;
}
