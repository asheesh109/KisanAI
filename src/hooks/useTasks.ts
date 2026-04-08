'use client';

import { useState, useEffect, useCallback } from 'react';

export type TaskType = 'irrigation' | 'fertilizer' | 'harvest' | 'spray' | 'custom';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  notes?: string;
  createdAt: string; // ISO timestamp
  completedAt?: string;
}

const STORAGE_KEY = 'kisanai_tasks';
const DB_NAME = 'KisanAIDB';
const STORE_NAME = 'tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize storage - fallback to localStorage if IndexedDB not available
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      let loadedTasks: Task[] = [];

      // Try IndexedDB first
      if ('indexedDB' in window) {
        try {
          loadedTasks = await loadFromIndexedDB();
        } catch (idbError) {
          console.warn('[TASKS] IndexedDB failed, falling back to localStorage:', idbError);
          loadedTasks = loadFromLocalStorage();
        }
      } else {
        loadedTasks = loadFromLocalStorage();
      }

      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      console.error('[TASKS] Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromIndexedDB = async (): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  };

  const loadFromLocalStorage = (): Task[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('[TASKS] LocalStorage error:', err);
      return [];
    }
  };

  const saveToIndexedDB = async (tasksToSave: Task[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        // Clear and rewrite
        objectStore.clear();
        tasksToSave.forEach(task => {
          objectStore.add(task);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  };

  const saveToLocalStorage = (tasksToSave: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (err) {
      console.error('[TASKS] LocalStorage save error:', err);
    }
  };

  const saveTasks = useCallback(async (tasksToSave: Task[]) => {
    try {
      setTasks(tasksToSave);

      if ('indexedDB' in window) {
        try {
          await saveToIndexedDB(tasksToSave);
        } catch (idbError) {
          console.warn('[TASKS] IndexedDB save failed, using localStorage:', idbError);
          saveToLocalStorage(tasksToSave);
        }
      } else {
        saveToLocalStorage(tasksToSave);
      }
    } catch (err) {
      console.error('[TASKS] Error saving tasks:', err);
      setError('Failed to save tasks');
    }
  }, []);

  const addTask = useCallback(
    async (title: string, type: TaskType, date: string, notes?: string) => {
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        title,
        type,
        date,
        status: 'pending',
        notes,
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [...tasks, newTask];
      await saveTasks(updatedTasks);
      return newTask;
    },
    [tasks, saveTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      await saveTasks(updatedTasks);
    },
    [tasks, saveTasks]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() }
          : t
      );
      await saveTasks(updatedTasks);
    },
    [tasks, saveTasks]
  );

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  const getTodaysTasks = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    console.log('[TASKS] getTodaysTasks called for date:', today);
    const result = getTasksByDate(today);
    console.log('[TASKS] getTodaysTasks result:', result);
    return result;
  }, [getTasksByDate]);

  const getUpcomingTasks = useCallback((days: number = 7) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= today && taskDate <= futureDate;
    });
  }, [tasks]);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    deleteTask,
    completeTask,
    getTasksByDate,
    getTodaysTasks,
    getUpcomingTasks,
    loadTasks,
  };
}
