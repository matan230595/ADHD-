// src/components/TaskList.tsx
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface Props {
  onFocusTask: (taskTitle: string) => void;
  mainTaskTitle?: string;
}

const getAutoSteps = (mainTaskTitle: string): string[] => [
  `\u05DC\u05E4\u05EA\u05D5\u05D7 \u05D0\u05EA \u05DE\u05D4 \u05E9\u05E6\u05E8\u05D9\u05DA \u05D1\u05E9\u05D1\u05D9\u05DC "${mainTaskTitle}" (\u05E7\u05D5\u05D1\u05E5 / \u05D3\u05E4\u05D3\u05E4\u05DF / \u05DE\u05E1\u05DE\u05DA)`,
  `\u05DC\u05E8\u05E9\u05D5\u05DD \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA / \u05E8\u05D0\u05E9\u05D9 \u05E4\u05E8\u05E7\u05D9\u05DD \u05E2\u05D1\u05D5\u05E8 "${mainTaskTitle}"`,
  `\u05DC\u05D1\u05E6\u05E2 \u05D0\u05EA \u05D4\u05D7\u05DC\u05E7 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05D4\u05DB\u05D9 \u05E7\u05D8\u05DF \u05E9\u05DC "${mainTaskTitle}"`,
  `\u05D4\u05E4\u05E1\u05E7\u05D4 \u05E7\u05E6\u05E8\u05D4 (5 \u05D3\u05E7')`,
  `\u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05DC\u05E2\u05D5\u05D3 \u05D7\u05DC\u05E7 \u05E7\u05D8\u05DF \u05E9\u05DC "${mainTaskTitle}"`,
];

export const TaskList: React.FC<Props> = ({ onFocusTask, mainTaskTitle }) => {
  const { state, addTask, updateTaskStatus, deleteTask } = useAppContext();
  const [customStep, setCustomStep] = useState('');
  // Bug 6: Track whether auto-breakdown has been used
  const [autoBreakdownUsed, setAutoBreakdownUsed] = useState(false);

  const todayTasks = useMemo(
    () => state.tasks.filter((t) => t.isToday),
    [state.tasks]
  );

  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    updateTaskStatus(task.id, newStatus);
  };

  const handleFocus = (task: Task) => {
    onFocusTask(task.title);
  };

  // Improvement 9: Delete task handler
  const handleDelete = (task: Task) => {
    deleteTask(task.id);
  };

  const handleAddCustom = () => {
    if (!customStep.trim()) return;
    addTask(customStep.trim(), 'MAIN');
    setCustomStep('');
  };

  // Bug 6 fix: Prevent duplicate auto-breakdown by disabling after first use
  const handleAutoBreakdown = () => {
    if (!mainTaskTitle || autoBreakdownUsed) return;
    const steps = getAutoSteps(mainTaskTitle);
    steps.forEach((title) => addTask(title, 'MAIN'));
    setAutoBreakdownUsed(true);
  };

  return (
    <div className="card">
      <h2>{'\u05DE\u05E9\u05D9\u05DE\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD'}</h2>
      {mainTaskTitle && (
        <div className="task-main-label">
          <strong>{'\u05D4\u05DE\u05E9\u05D9\u05DE\u05D4 \u05D4\u05DE\u05E8\u05DB\u05D6\u05D9\u05EA:'}</strong> {mainTaskTitle}
        </div>
      )}

      <div className="task-actions-row">
        <button
          onClick={handleAutoBreakdown}
          disabled={autoBreakdownUsed || !mainTaskTitle}
          className={`btn btn--primary ${autoBreakdownUsed ? 'btn--disabled' : ''}`}
        >
          {autoBreakdownUsed ? '\u05E4\u05D9\u05E8\u05D5\u05E7 \u05E0\u05D5\u05E6\u05E8' : '\u05D9\u05E6\u05D9\u05E8\u05EA \u05E4\u05D9\u05E8\u05D5\u05E7 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9'}
        </button>
      </div>

      <div className="task-custom-step">
        <div className="focus-label">{'\u05DC\u05D4\u05D5\u05E1\u05D9\u05E3 \u05E6\u05E2\u05D3 \u05D9\u05D3\u05E0\u05D9:'}</div>
        <div className="task-custom-step-row">
          <input
            value={customStep}
            onChange={(e) => setCustomStep(e.target.value)}
            placeholder={'\u05DE\u05D4 \u05D4\u05E6\u05E2\u05D3 \u05D4\u05E7\u05D8\u05DF \u05D4\u05D1\u05D0?'}
            className="focus-input"
          />
          <button onClick={handleAddCustom} className="btn btn--add">
            {'\u05D4\u05D5\u05E1\u05E3'}
          </button>
        </div>
      </div>

      {todayTasks.length === 0 ? (
        <div className="task-empty">
          {'\u05D0\u05D9\u05DF \u05DE\u05E9\u05D9\u05DE\u05D5\u05EA \u05DC\u05D4\u05D9\u05D5\u05DD. \u05D4\u05D2\u05D3\u05E8 \u05DE\u05E9\u05D9\u05DE\u05D4 \u05DE\u05E8\u05DB\u05D6\u05D9\u05EA \u05D5\u05E4\u05E8\u05E7 \u05D0\u05D5\u05EA\u05D4 \u05DC\u05E6\u05E2\u05D3\u05D9\u05DD \u05E7\u05D8\u05E0\u05D9\u05DD.'}
        </div>
      ) : (
        <div>
          {todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onFocus={handleFocus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
