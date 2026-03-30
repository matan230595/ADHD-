// src/components/OverwhelmMode.tsx
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface Props {
  onStartTinyFocus: (taskTitle: string, minutes: number) => void;
}

// Improvement 10: Moved inline styles to CSS classes
export const OverwhelmMode: React.FC<Props> = ({ onStartTinyFocus }) => {
  const { addTask } = useAppContext();
  const [visible, setVisible] = useState(false);

  const handleClick = () => setVisible((v) => !v);

  const handleOption = (type: 'open' | 'oneSentence' | 'fiveMinutes') => {
    if (type === 'open') {
      const t = addTask('\u05E8\u05E7 \u05DC\u05E4\u05EA\u05D5\u05D7 \u05D0\u05EA \u05DE\u05D4 \u05E9\u05E6\u05E8\u05D9\u05DA (\u05E7\u05D5\u05D1\u05E5/\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4) \u05DC\u05DE\u05E9\u05D9\u05DE\u05D4 \u05D4\u05D1\u05D0\u05D4');
      onStartTinyFocus(t.title, 3);
    } else if (type === 'oneSentence') {
      const t = addTask('\u05DC\u05DB\u05EA\u05D5\u05D1 \u05E8\u05E7 \u05DE\u05E9\u05E4\u05D8 \u05D0\u05D7\u05D3 \u05D5\u05DC\u05D4\u05E4\u05E1\u05D9\u05E7 \u05D0\u05DD \u05E7\u05E9\u05D4');
      onStartTinyFocus(t.title, 5);
    } else if (type === 'fiveMinutes') {
      const t = addTask('\u05DC\u05E2\u05D1\u05D5\u05D3 5 \u05D3\u05E7\u05D5\u05EA \u05D1\u05DC\u05D1\u05D3 \u05D5\u05D0\u05D6 \u05DC\u05D4\u05D7\u05DC\u05D9\u05D8 \u05DE\u05D7\u05D3\u05E9');
      onStartTinyFocus(t.title, 5);
    }
    setVisible(false);
  };

  return (
    <div className="card">
      <button onClick={handleClick} className="overwhelm-btn">
        {'\u05D0\u05E0\u05D9 \u05DE\u05E8\u05D2\u05D9\u05E9/\u05D4 \u05DE\u05D5\u05E6\u05E3/\u05EA'}
      </button>

      {visible && (
        <div className="overwhelm-options">
          <div className="overwhelm-hint">
            {'\u05D1\u05D5\u05D0\u05D9/\u05D1\u05D5\u05D0 \u05E0\u05E2\u05E9\u05D4 \u05DE\u05E9\u05D4\u05D5 \u05DE\u05DE\u05E9 \u05E7\u05D8\u05DF \u05E9\u05D0\u05EA\u05D4 \u05DB\u05DF \u05D9\u05DB\u05D5\u05DC/\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5:'}
          </div>
          <div className="overwhelm-list">
            <button onClick={() => handleOption('open')} className="overwhelm-option-btn">
              {'\u05E8\u05E7 \u05DC\u05E4\u05EA\u05D5\u05D7 \u05D0\u05EA \u05DE\u05D4 \u05E9\u05E6\u05E8\u05D9\u05DA (\u05E7\u05D5\u05D1\u05E5 / \u05D0\u05EA\u05E8 / \u05DE\u05E1\u05DE\u05DA)'}
            </button>
            <button onClick={() => handleOption('oneSentence')} className="overwhelm-option-btn">
              {'\u05DC\u05DB\u05EA\u05D5\u05D1 \u05E8\u05E7 \u05DE\u05E9\u05E4\u05D8 \u05D0\u05D7\u05D3 \u05D5\u05D0\u05D6 \u05DE\u05D5\u05EA\u05E8 \u05DC\u05D4\u05E4\u05E1\u05D9\u05E7'}
            </button>
            <button onClick={() => handleOption('fiveMinutes')} className="overwhelm-option-btn">
              {'\u05DC\u05E2\u05D1\u05D5\u05D3 5 \u05D3\u05E7\u05D5\u05EA \u05D5\u05D0\u05D6 \u05DC\u05D4\u05D7\u05DC\u05D9\u05D8 \u05D0\u05DD \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
