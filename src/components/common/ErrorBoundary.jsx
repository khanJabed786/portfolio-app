import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    const section = props.section || "Unknown";
    console.log(`[ErrorBoundary] Initialized for section: ${section}`);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    const section = this.props.section || "Unknown";
    console.error(`[ErrorBoundary] Error in ${section}:`, error);
    console.error(`[ErrorBoundary] Component Stack:`, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const section = this.props.section || "Unknown";
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-red-500/10 border border-red-500/30 rounded-lg m-4">
          <div className="max-w-xl w-full glass p-8 border border-red-500/50">
            <h1 className="text-2xl font-semibold text-red-400">Error in {section}</h1>
            <p className="mt-3 text-white/80">
              Something went wrong in this section. Please refresh the page.
            </p>
            <div className="mt-5 flex gap-2 flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="ripple-btn px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10 transition"
              >
                Try Again
              </button>
            </div>

            {this.state.error ? (
              <pre className="mt-6 text-xs text-red-300 overflow-auto max-h-32 bg-red-900/20 p-3 rounded">
                {String(this.state.error?.message || this.state.error)}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}