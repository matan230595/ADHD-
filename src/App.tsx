// src/App.tsx
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { NavBar } from './components/NavBar';
import { MainTaskInput } from './components/MainTaskInput';
import { TaskList } from './components/TaskList';
import { FocusTimer } from './components/FocusTimer';
import { OverwhelmMode } from './components/OverwhelmMode';
import { DailySummary } from './components/DailySummary';
import { StatsPanel } from './components/StatsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

const TodayView: React.FC = () => {
  const { getMainTaskForToday } = useAppContext();
  const [focusKey, setFocusKey] = useState(0);
  const [focusInitialTitle, setFocusInitialTitle] = useState<string | undefined>(undefined);

  const main = getMainTaskForToday();

  const handleFocusTask = (taskTitle: string) => {
    setFocusInitialTitle(taskTitle);
    setFocusKey((k) => k + 1); // מרענן את הטיימר עם משימה חדשה
  };

  const handleBreakdownFromMain = (mainTaskTitle: string) => {
    // אפשר פשוט לעבור ל־TaskList כי הפירוק מתבצע שם
    // כאן לא נדרש קוד נוסף
    console.log('Main task set:', mainTaskTitle);
  };

  const handleTinyFocusFromOverwhelm = (taskTitle: string, minutes: number) => {
    setFocusInitialTitle(taskTitle + ` (${minutes} דק' קטנות)`);
    setFocusKey((k) => k + 1);
  };

  return (
    <div className="main-content">
      <MainTaskInput onBreakdown={handleBreakdownFromMain} />
      <TaskList onFocusTask={handleFocusTask} mainTaskTitle={main?.title} />
      <OverwhelmMode onStartTinyFocus={handleTinyFocusFromOverwhelm} />
      <FocusTimer key={focusKey} initialTaskTitle={focusInitialTitle || main?.title} />
      <DailySummary />
    </div>
  );
};

const StatsView: React.FC = () => {
  return (
    <div className="main-content">
      <StatsPanel />
    </div>
  );
};

const AppInner: React.FC = () => {
  const [tab, setTab] = useState<'today' | 'stats'>('today');

  return (
    <Layout>
      <NavBar activeTab={tab} onChangeTab={setTab} />
      {tab === 'today' ? <TodayView /> : <StatsView />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;