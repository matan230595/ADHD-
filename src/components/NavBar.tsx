// src/components/NavBar.tsx
import React from 'react';

interface Props {
  activeTab: 'today' | 'stats';
  onChangeTab: (tab: 'today' | 'stats') => void;
}

// Improvement 10: Moved inline styles to CSS classes
export const NavBar: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">ADHD Web Focus</div>
      <div className="navbar-tabs">
        <button
          onClick={() => onChangeTab('today')}
          className={`navbar-tab ${activeTab === 'today' ? 'navbar-tab--active' : ''}`}
        >
          {'\u05D4\u05D9\u05D5\u05DD'}
        </button>
        <button
          onClick={() => onChangeTab('stats')}
          className={`navbar-tab ${activeTab === 'stats' ? 'navbar-tab--active' : ''}`}
        >
          {'\u05E1\u05D8\u05D8\u05D9\u05E1\u05D8\u05D9\u05E7\u05D5\u05EA'}
        </button>
      </div>
    </nav>
  );
};
