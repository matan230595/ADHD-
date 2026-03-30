// src/components/TaskItem.tsx
import React from 'react';
import { Task } from '../types';

interface Props {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onFocus: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Improvement 9: Added delete button + Improvement 10: Moved inline styles to CSS classes
export const TaskItem: React.FC<Props> = ({ task, onToggleStatus, onFocus, onDelete }) => {
  const isDone = task.status === 'done';

  return (
    <div className={`task-item ${isDone ? 'task-item--done' : ''}`}>
      <div className="task-item-row">
        <div className={`task-item-title ${isDone ? 'task-item-title--done' : ''}`}>
          {task.title}
        </div>
        <div className="task-item-actions">
          <button
            onClick={() => onToggleStatus(task)}
            className="btn btn--toggle"
          >
            {isDone ? '\u05DC\u05D4\u05D7\u05D6\u05D9\u05E8 \u05DC\u05DE\u05E9\u05D9\u05DE\u05D4' : '\u05E1\u05DE\u05DF \u05DB\u05D1\u05D5\u05E6\u05E2'}
          </button>
          <button
            onClick={() => onFocus(task)}
            className="btn btn--focus"
          >
            {'\u05E4\u05D5\u05E7\u05D5\u05E1'}
          </button>
          <button
            onClick={() => onDelete(task)}
            className="btn btn--delete"
          >
            {'\u05DE\u05D7\u05E7'}
          </button>
        </div>
      </div>
    </div>
  );
};
