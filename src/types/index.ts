export type Priority = 'low' | 'medium' | 'high';

export type Category = 'All' | 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Other';

export interface User {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

