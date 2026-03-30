// src/components/DailySummary.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

// Improvement 10: Minimal inline styles remain only where dynamic
export const DailySummary: React.FC = () => {
  const { state } = useAppContext();
  const today = new Date().toISOString().slice(0, 10);
  const tasksToday = state.tasks.filter((t) => t.scheduledFor === today);
  const doneToday = tasksToday.filter((t) => t.status === 'done');

  return (
    <div className="card">
      <h3>{'\u05E1\u05D9\u05DB\u05D5\u05DD \u05D4\u05D9\u05D5\u05DD \u05D4\u05E7\u05E6\u05E8'}</h3>
      <div>
        <strong>{'\u05D1\u05D5\u05E6\u05E2:'}</strong> {doneToday.length} {'\u05DE\u05EA\u05D5\u05DA'} {tasksToday.length} {'\u05DE\u05E9\u05D9\u05DE\u05D5\u05EA.'}
      </div>
      <div className="focus-label">
        {'\u05D2\u05DD \u05D0\u05DD \u05DC\u05D0 \u05E1\u05D9\u05D9\u05DE\u05EA \u05D4\u05DB\u05D5\u05DC \u2013 \u05DB\u05DC \u05E6\u05E2\u05D3 \u05E7\u05D8\u05DF \u05E0\u05D7\u05E9\u05D1. \u05DE\u05D7\u05E8 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E0\u05E1\u05D5\u05EA \u05E6\u05E2\u05D3 \u05D0\u05D7\u05D3 \u05E9\u05D5\u05E0\u05D4.'}
      </div>
    </div>
  );
};
