import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * Swappable persistence adapter.
 *
 * Everything above this file talks to `storage` only, so moving to a server-backed
 * store later means implementing this interface against the API and changing the
 * export below — no screen or store logic changes.
 */
export const storage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};

export const STORAGE_KEY = 'cornerstone.study.v1';
