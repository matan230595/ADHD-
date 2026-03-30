// src/components/Layout.tsx
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="app-root">{children}</div>;
};