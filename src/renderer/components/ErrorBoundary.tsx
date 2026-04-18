import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo
    });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.77-1.54-2-1.54-2H5.268c-.77 0-1.54 1.23-1.54 3L5.268 16.667c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">应用出错了</h1>
              <p className="text-gray-600 mb-4">
                很抱歉，应用遇到了一个错误。请尝试刷新页面或重启应用。
              </p>
              <div className="bg-gray-100 rounded-md p-4 mb-4 text-left">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">错误信息:</h2>
                <p className="text-sm text-gray-600 font-mono whitespace-pre-wrap">
                  {this.state.error?.toString() || '未知错误'}
                </p>
              </div>
              {this.state.errorInfo && (
                <div className="bg-gray-100 rounded-md p-4 mb-4 text-left">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">错误堆栈:</h2>
                  <p className="text-xs text-gray-600 font-mono whitespace-pre-wrap max-h-24 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </p>
                </div>
              )}
              <button
                onClick={this.resetErrorBoundary}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;