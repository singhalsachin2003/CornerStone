import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Whether the reader has asked the system to reduce motion.
 *
 * Cornerstone's central interaction is a card you drag and flip, built on
 * reanimated, and people who turn this setting on are usually not expressing a
 * preference — vestibular disorders and motion sickness are the common reasons,
 * and a spring-animated card sliding under the thumb is exactly the motion the
 * setting exists to suppress.
 *
 * Honouring it does not mean removing the interaction. The card still moves
 * with the finger, because that is direct manipulation rather than animation;
 * what goes is the springy settle afterwards and the fades, which are motion
 * the app invents on its own.
 *
 * Reads the current value on mount and then listens, because the setting can be
 * changed while the app is backgrounded — and a study app is backgrounded
 * constantly.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let alive = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (alive) setReduced(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) =>
      setReduced(enabled),
    );

    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
