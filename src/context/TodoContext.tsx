import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Category, Priority, Todo } from '../types';
import { useAuth } from './AuthContext';
import { getTodosForUser, saveTodosForUser } from '../services/storage';
import { isSupabaseConfigured, supabase } from '../services/supabase';

interface CreateTodoInput {
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: string;
}

interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string;
  completed?: boolean;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  isLoading: boolean;
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (status: 'all' | 'pending' | 'completed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  stats: Stats;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadTodos = async () => {
    if (!user) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Try fetching from Supabase table if it exists
        try {
          const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            const mapped: Todo[] = data.map((item: any) => ({
              id: item.id,
              userId: item.user_id,
              title: item.title,
              description: item.description || '',
              completed: !!item.completed,
              priority: (item.priority || 'medium') as Priority,
              category: (item.category || 'Personal') as Category,
              createdAt: item.created_at,
              updatedAt: item.updated_at || item.created_at,
              dueDate: item.due_date || undefined,
            }));
            setTodos(mapped);
            await saveTodosForUser(user.id, mapped);
            return;
          }
        } catch {
          // Fall back to local storage if supabase query fails or table does not exist
        }
      }

      // Local storage fallback
      const local = await getTodosForUser(user.id);
      setTodos(local);
    } catch (err) {
      console.error('Failed to load todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user?.id]);

  const persistTodos = async (newTodos: Todo[]) => {
    if (!user) return;
    setTodos(newTodos);
    await saveTodosForUser(user.id, newTodos);
  };

  const addTodo = async (input: CreateTodoInput) => {
    if (!user || !input.title.trim()) return;

    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      completed: false,
      priority: input.priority,
      category: input.category === 'All' ? 'Personal' : input.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: input.dueDate,
    };

    const updated = [newTodo, ...todos];
    await persistTodos(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('todos').insert({
          id: newTodo.id,
          user_id: user.id,
          title: newTodo.title,
          description: newTodo.description,
          completed: newTodo.completed,
          priority: newTodo.priority,
          category: newTodo.category,
          created_at: newTodo.createdAt,
          updated_at: newTodo.updatedAt,
          due_date: newTodo.dueDate,
        });
      } catch (e) {
        console.warn('Failed to insert todo into Supabase:', e);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const updatedCompleted = !target.completed;
    const updated = todos.map((t) =>
      t.id === id
        ? { ...t, completed: updatedCompleted, updatedAt: new Date().toISOString() }
        : t
    );
    await persistTodos(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('todos')
          .update({ completed: updatedCompleted, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.warn('Failed to update todo on Supabase:', e);
      }
    }
  };

  const updateTodo = async (id: string, updates: UpdateTodoInput) => {
    const updated = todos.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          category: updates.category === 'All' ? t.category : updates.category || t.category,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    await persistTodos(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('todos')
          .update({
            ...(updates.title !== undefined && { title: updates.title }),
            ...(updates.description !== undefined && { description: updates.description }),
            ...(updates.priority !== undefined && { priority: updates.priority }),
            ...(updates.category !== undefined && { category: updates.category }),
            ...(updates.completed !== undefined && { completed: updates.completed }),
            ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Failed to update todo on Supabase:', e);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    await persistTodos(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('todos').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete todo on Supabase:', e);
      }
    }
  };

  const clearCompleted = async () => {
    const updated = todos.filter((t) => !t.completed);
    await persistTodos(updated);

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('todos').delete().eq('user_id', user.id).eq('completed', true);
      } catch (e) {
        console.warn('Failed to clear completed on Supabase:', e);
      }
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Category filter
      if (activeCategory !== 'All' && todo.category !== activeCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'pending' && todo.completed) {
        return false;
      }
      if (statusFilter === 'completed' && !todo.completed) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = (todo.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [todos, activeCategory, statusFilter, searchQuery]);

  const stats: Stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percentage };
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        isLoading,
        activeCategory,
        setActiveCategory,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        stats,
        refreshTodos: loadTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

