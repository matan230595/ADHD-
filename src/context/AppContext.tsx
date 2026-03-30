// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { AppState, Task, TaskStatus, FocusSession, MainTaskOfDay } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

// Improvement 9: Added DELETE_TASK action
type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: TaskStatus } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_MAIN_TASK_FOR_TODAY'; payload: MainTaskOfDay }
  | { type: 'ADD_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'UPDATE_FOCUS_SESSION'; payload: FocusSession };

interface AppContextValue {
  state: AppState;
  addTask: (title: string, parentId?: string | null) => Task;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  setMainTaskForToday: (title: string) => void;
  getMainTaskForToday: () => MainTaskOfDay | undefined;
  addFocusSession: (session: FocusSession) => void;
  updateFocusSession: (session: FocusSession) => void;
  generateId: () => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialState: AppState = {
  tasks: [],
  focusSessions: [],
  mainTasks: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, status: action.payload.status } : t
        ),
      };
    // Improvement 9: Delete task reducer case
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case 'SET_MAIN_TASK_FOR_TODAY':
      return {
        ...state,
        mainTasks: [
          ...state.mainTasks.filter((m) => m.date !== action.payload.date),
          action.payload,
        ],
      };
    case 'ADD_FOCUS_SESSION':
      return { ...state, focusSessions: [...state.focusSessions, action.payload] };
    case 'UPDATE_FOCUS_SESSION':
      return {
        ...state,
        focusSessions: state.focusSessions.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useLocalStorage<AppState>('ADHD_WEB_APP_STATE', initialState);
  const [state, dispatch] = useReducer(appReducer, persisted);

  React.useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  // Improvement 12: Stabilize all context functions with useCallback
  const generateId = useCallback(() => uuidv4(), []);

  const addTask = useCallback((title: string, parentId?: string | null): Task => {
    const id = uuidv4();
    const today = new Date().toISOString().slice(0, 10);
    const newTask: Task = {
      id,
      title: title.trim(),
      parentId: parentId ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledFor: today,
      isToday: true,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id, status } });
  }, []);

  // Improvement 9: Delete task function
  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const setMainTaskForToday = useCallback((title: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const main: MainTaskOfDay = { date: today, title: title.trim() };
    dispatch({ type: 'SET_MAIN_TASK_FOR_TODAY', payload: main });
  }, []);

  const getMainTaskForToday = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return state.mainTasks.find((m) => m.date === today);
  }, [state.mainTasks]);

  const addFocusSession = useCallback((session: FocusSession) => {
    dispatch({ type: 'ADD_FOCUS_SESSION', payload: session });
  }, []);

  const updateFocusSession = useCallback((session: FocusSession) => {
    dispatch({ type: 'UPDATE_FOCUS_SESSION', payload: session });
  }, []);

  // Improvement 12: useMemo with all stabilized callback dependencies
  const value: AppContextValue = useMemo(
    () => ({
      state,
      addTask,
      updateTaskStatus,
      deleteTask,
      setMainTaskForToday,
      getMainTaskForToday,
      addFocusSession,
      updateFocusSession,
      generateId,
    }),
    [state, addTask, updateTaskStatus, deleteTask, setMainTaskForToday, getMainTaskForToday, addFocusSession, updateFocusSession, generateId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
