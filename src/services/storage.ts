import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, User } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: '@todoapp_current_user',
  LOCAL_USERS: '@todoapp_local_users',
  TODOS_PREFIX: '@todoapp_todos_',
};

export interface LocalUserRecord extends User {
  password?: string;
}

export const getStoredSession = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredSession = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Failed to set stored session:', error);
  }
};

export const getLocalUsers = async (): Promise<LocalUserRecord[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.LOCAL_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalUser = async (userRecord: LocalUserRecord): Promise<void> => {
  try {
    const users = await getLocalUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === userRecord.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = userRecord;
    } else {
      users.push(userRecord);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save local user:', error);
  }
};

const getSampleTodos = (userId: string): Todo[] => [
  {
    id: 'demo-1',
    userId,
    title: 'Welcome to your Todo App! 👋',
    description: 'Tap on the checkbox to mark tasks as completed, or tap to edit details.',
    completed: false,
    priority: 'high',
    category: 'Personal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    userId,
    title: 'Explore categories & priorities',
    description: 'Organize tasks with Work, Personal, Shopping, and Health tags.',
    completed: true,
    priority: 'medium',
    category: 'Work',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    userId,
    title: 'Add a new task',
    description: 'Use the floating + button in the bottom right corner to add anything.',
    completed: false,
    priority: 'low',
    category: 'Other',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getTodosForUser = async (userId: string): Promise<Todo[]> => {
  try {
    const key = `${STORAGE_KEYS.TODOS_PREFIX}${userId}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      // Seed with initial welcome todos
      const sample = getSampleTodos(userId);
      await AsyncStorage.setItem(key, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
};

export const saveTodosForUser = async (userId: string, todos: Todo[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.TODOS_PREFIX}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};

