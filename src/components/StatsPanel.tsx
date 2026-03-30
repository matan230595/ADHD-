// src/components/StatsPanel.tsx
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDurationMinutes, formatDate } from '../utils/time';

// Improvement 10: Moved inline styles to CSS classes
export const StatsPanel: React.FC = () => {
  const { state } = useAppContext();

  const stats = useMemo(() => {
    const totalSessions = state.focusSessions.length;
    const completedSessions = state.focusSessions.filter((s) => !s.interrupted && s.endTime);
    const interruptedSessions = state.focusSessions.filter((s) => s.interrupted);

    const totalMinutes = completedSessions.reduce(
      (sum, s) => sum + (s.durationMinutes || 0),
      0
    );

    const lastSessions = [...state.focusSessions]
      .sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
      .slice(0, 5);

    return {
      totalSessions,
      completedSessions: completedSessions.length,
      interruptedSessions: interruptedSessions.length,
      totalMinutes,
      lastSessions,
    };
  }, [state.focusSessions]);

  return (
    <div className="card">
      <h2>{'\u05E1\u05D8\u05D8\u05D9\u05E1\u05D8\u05D9\u05E7\u05D5\u05EA \u05E4\u05D5\u05E7\u05D5\u05E1'}</h2>
      <div className="stats-info">
        <div>{'\u05E1\u05D4"\u05DB \u05E1\u05E9\u05E0\u05D9\u05DD:'} {stats.totalSessions}</div>
        <div>{'\u05E1\u05E9\u05E0\u05D9\u05DD \u05E9\u05D4\u05D5\u05E9\u05DC\u05DE\u05D5:'} {stats.completedSessions}</div>
        <div>{'\u05E1\u05E9\u05E0\u05D9\u05DD \u05E9\u05E0\u05E7\u05D8\u05E2\u05D5:'} {stats.interruptedSessions}</div>
        <div>{'\u05D6\u05DE\u05DF \u05E4\u05D5\u05E7\u05D5\u05E1 \u05DE\u05E6\u05D8\u05D1\u05E8:'} {formatDurationMinutes(stats.totalMinutes)}</div>
      </div>

      <h3>{'\u05E1\u05E9\u05E0\u05D9\u05DD \u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD'}</h3>
      {stats.lastSessions.length === 0 ? (
        <div className="task-empty">{'\u05E2\u05D5\u05D3 \u05D0\u05D9\u05DF \u05E1\u05E9\u05E0\u05D9 \u05E4\u05D5\u05E7\u05D5\u05E1.'}</div>
      ) : (
        <ul className="stats-list">
          {stats.lastSessions.map((s) => (
            <li key={s.id} className="stats-session">
              <div>
                <strong>{s.taskTitle || '\u05E4\u05D5\u05E7\u05D5\u05E1 \u05DB\u05DC\u05DC\u05D9'}</strong>
              </div>
              <div className="stats-session-detail">
                {s.startTime && (
                  <>{'\u05DE\u05EA\u05D0\u05E8\u05D9\u05DA'} {formatDate(s.startTime)} </>
                )}
                {s.durationMinutes && (
                  <>&ndash; {s.durationMinutes} {'\u05D3\u05E7\u05D5\u05EA'}</>
                )}
                {s.interrupted && <> ({'\u05E0\u05E7\u05D8\u05E2'})</>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
