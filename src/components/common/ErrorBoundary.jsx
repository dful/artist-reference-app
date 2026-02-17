import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service in production
    if (import.meta.env.PROD) {
      // Replace with your error reporting service
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-sm text-red-600 dark:text-red-400 overflow-auto max-h-48">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" onClick={this.handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
