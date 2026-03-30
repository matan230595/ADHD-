// src/components/FocusTimer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { FocusSession } from '../types';

const PRESETS = [10, 15, 25]; // minutes

interface Props {
  initialTaskTitle?: string;
}

export const FocusTimer: React.FC<Props> = ({ initialTaskTitle }) => {
  const { addFocusSession, updateFocusSession, generateId } = useAppContext();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [running, setRunning] = useState(false);
  const [taskTitle, setTaskTitle] = useState(initialTaskTitle || '\u05E4\u05D5\u05E7\u05D5\u05E1 \u05DB\u05DC\u05DC\u05D9');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const sessionRef = useRef<FocusSession | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  // Bug 2 fix: Move session-end detection out of setState updater into a useEffect
  const handleSessionEnd = useCallback((interrupted: boolean) => {
    setRunning(false);
    const session = sessionRef.current;
    if (!session) return;
    const end = new Date().toISOString();
    const start = new Date(session.startTime);
    const durationMinutes = Math.round(
      (new Date(end).getTime() - start.getTime()) / 1000 / 60
    );
    const updated: FocusSession = {
      ...session,
      endTime: end,
      durationMinutes,
      interrupted,
    };
    updateFocusSession(updated);
    sessionRef.current = null;

    // Improvement 7: Replace alert() with inline message
    if (!interrupted) {
      setMessage({ text: '\u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3! \u05E1\u05D9\u05D9\u05DE\u05EA \u05E1\u05E9\u05DF \u05E4\u05D5\u05E7\u05D5\u05E1.', type: 'success' });
    }
  }, [updateFocusSession]);

  // Timer tick effect - no longer calls handleSessionEnd inside setState
  useEffect(() => {
    if (running) {
      const id = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      intervalRef.current = id;
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  // Bug 2 fix: Detect timer completion via useEffect watching secondsLeft
  useEffect(() => {
    if (secondsLeft === 0 && running) {
      handleSessionEnd(false);
    }
  }, [secondsLeft, running, handleSessionEnd]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startNewSession = () => {
    const session: FocusSession = {
      id: generateId(),
      taskTitle: taskTitle || '\u05E4\u05D5\u05E7\u05D5\u05E1 \u05DB\u05DC\u05DC\u05D9',
      startTime: new Date().toISOString(),
      interrupted: false,
    };
    sessionRef.current = session;
    addFocusSession(session);
  };

  const handleStart = () => {
    setMessage(null);
    if (secondsLeft === 0) {
      setSecondsLeft(selectedMinutes * 60);
    }
    if (!running) {
      startNewSession();
    }
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  // Bug 3 fix: End session on reset if one is active
  const handleReset = () => {
    if (sessionRef.current && running) {
      handleSessionEnd(true);
    }
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
    setMessage(null);
  };

  // Improvement 7: Replace alert() with inline message
  const handleIAmDistracted = () => {
    handleSessionEnd(true);
    setMessage({ text: '\u05D4\u05DB\u05D5\u05DC \u05D8\u05D5\u05D1. \u05E7\u05D5\u05E8\u05D4. \u05D1\u05D5\u05D0 \u05E0\u05D7\u05D6\u05D5\u05E8 \u05D1\u05E2\u05D3\u05D9\u05E0\u05D5\u05EA \u05DC\u05DE\u05E9\u05D9\u05DE\u05D4 \u05D1\u05E6\u05E2\u05D3 \u05E7\u05D8\u05DF \u05D0\u05D7\u05D3.', type: 'info' });
  };

  return (
    <div className="card">
      <h2>{'\u05DE\u05E6\u05D1 \u05E4\u05D5\u05E7\u05D5\u05E1'}</h2>

      {message && (
        <div className={`focus-message focus-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="focus-label">{'\u05D4\u05DE\u05E9\u05D9\u05DE\u05D4 \u05E9\u05DC\u05DA \u05E2\u05DB\u05E9\u05D9\u05D5:'}</div>
      <input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="focus-input"
      />

      <div className="focus-label">{'\u05DB\u05DE\u05D4 \u05D6\u05DE\u05DF \u05DE\u05E8\u05D2\u05D9\u05E9 \u05D0\u05E4\u05E9\u05E8\u05D9 \u05E2\u05DB\u05E9\u05D9\u05D5?'}</div>
      <div className="focus-presets">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => {
              setSelectedMinutes(m);
              setSecondsLeft(m * 60);
            }}
            className={`focus-preset-btn ${selectedMinutes === m ? 'focus-preset-btn--active' : ''}`}
          >
            {m} {'\u05D3\u05E7\u05D5\u05EA'}
          </button>
        ))}
      </div>

      <div className="focus-timer-display">
        {formatTime(secondsLeft)}
      </div>

      <div className="focus-actions">
        {!running ? (
          <button onClick={handleStart} className="btn btn--start">
            {'\u05D4\u05EA\u05D7\u05DC'}
          </button>
        ) : (
          <button onClick={handlePause} className="btn btn--pause">
            {'\u05E2\u05E6\u05D5\u05E8'}
          </button>
        )}
        <button onClick={handleReset} className="btn btn--reset">
          {'\u05D0\u05D9\u05E4\u05D5\u05E1'}
        </button>
      </div>

      <button onClick={handleIAmDistracted} className="btn btn--distracted">
        {'\u05D0\u05E0\u05D9 \u05DE\u05D5\u05E1\u05D7/\u05EA \u2013 \u05E2\u05D6\u05E8\u05D4 \u05DC\u05D7\u05D6\u05D5\u05E8 \u05D1\u05E2\u05D3\u05D9\u05E0\u05D5\u05EA'}
      </button>
    </div>
  );
};
