// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Improvement 11: Error Boundary to prevent full app crashes
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>{'\u05DE\u05E9\u05D4\u05D5 \u05D4\u05E9\u05EA\u05D1\u05E9'}</h2>
          <p>{'\u05E7\u05E8\u05EA\u05D4 \u05E9\u05D2\u05D9\u05D0\u05D4, \u05D0\u05D1\u05DC \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E9\u05DC\u05DA \u05E9\u05DE\u05D5\u05E8\u05D9\u05DD. \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1.'}</p>
          <button onClick={this.handleReset} className="btn btn--primary">
            {'\u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
