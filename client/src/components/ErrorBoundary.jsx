import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
            <div className="max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">LuxeStay</p>
              <h2 className="mt-4 text-2xl font-semibold text-stone-900">Something went wrong</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                We hit an unexpected error while loading this page. Please refresh and try again.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-[#c79f1f]"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
