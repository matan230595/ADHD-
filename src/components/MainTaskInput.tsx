// src/components/MainTaskInput.tsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface Props {
  onBreakdown: (mainTaskTitle: string) => void;
}

// Improvement 10: Moved inline styles to CSS classes
export const MainTaskInput: React.FC<Props> = ({ onBreakdown }) => {
  const { getMainTaskForToday, setMainTaskForToday } = useAppContext();
  const [mainTask, setMainTask] = useState('');

  // Bug 5 fix: Use empty dependency array for initial load only
  useEffect(() => {
    const existing = getMainTaskForToday();
    if (existing?.title) setMainTask(existing.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!mainTask.trim()) return;
    setMainTaskForToday(mainTask.trim());
    onBreakdown(mainTask.trim());
  };

  return (
    <div className="card">
      <h2>{'\u05DE\u05D4 \u05D4\u05D3\u05D1\u05E8 \u05D4\u05D9\u05D7\u05D9\u05D3 \u05E9\u05D4\u05DB\u05D9 \u05D7\u05E9\u05D5\u05D1 \u05E9\u05D9\u05E7\u05E8\u05D4 \u05D4\u05D9\u05D5\u05DD?'}</h2>
      <textarea
        value={mainTask}
        onChange={(e) => setMainTask(e.target.value)}
        placeholder={'\u05DC\u05D3\u05D5\u05D2\u05DE\u05D4: "\u05DC\u05E1\u05D9\u05D9\u05DD \u05D3\u05D5"\u05D7 \u05E2\u05D1\u05D5\u05D3\u05D4..."'}
        className="main-task-textarea"
      />
      <div className="main-task-actions">
        <button onClick={handleSave} className="btn btn--primary">
          {'\u05E9\u05DE\u05D5\u05E8 \u05D5\u05E4\u05E8\u05E7 \u05DC\u05DE\u05E9\u05D9\u05DE\u05D5\u05EA \u05E7\u05D8\u05E0\u05D5\u05EA'}
        </button>
      </div>
    </div>
  );
};
