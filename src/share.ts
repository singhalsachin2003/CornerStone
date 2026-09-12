import { Linking, Share } from 'react-native';

import { PLAY_LISTING_URL } from '@/links';

/**
 * The share sheet and outbound links, in one place.
 *
 * Both swallow their own failures: dismissing a share sheet is a normal
 * outcome rather than an error, and a device with no browser rejects
 * `openURL` outright. Neither is worth an unhandled rejection mid-screen.
 */

/** Written in the sharer's voice — it lands in their chat under their name. */
export function resultShareMessage(topic: string, correct: number, total: number): string {
  return `I scored ${correct}/${total} on ${topic} in Cornerstone.\n\n${PLAY_LISTING_URL}`;
}

export async function shareText(message: string): Promise<void> {
  try {
    await Share.share({ message });
  } catch {
    /* the reader keeps the screen they were on */
  }
}

export async function openExternal(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    /* as above */
  }
}
