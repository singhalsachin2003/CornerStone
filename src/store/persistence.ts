import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * Swappable persistence adapter.
 *
 * Everything above this file talks to `storage` only, so moving to a server-backed
 * store later means implementing this interface against the API and changing the
 * export below — no screen or store logic changes.
 *
 * Reads and writes are wrapped because the whole route tree is gated on hydration
 * finishing (see `app/_layout.tsx`). An AsyncStorage failure that propagates leaves
 * the app on a blank screen for good, so a failed read is reported as "nothing
 * saved" and a failed write is dropped — losing a session's progress beats
 * bricking the app or throwing mid-quiz.
 */
export const storage: StateStorage = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      /* dropped — see above */
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      /* dropped — see above */
    }
  },
};

export const STORAGE_KEY = 'cornerstone.study.v1';
