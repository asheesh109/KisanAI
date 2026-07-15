'use client';

import { Component } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

const DEFAULT_REPORT_ISSUE_URL = 'https://github.com/asheesh109/KisanAI/issues/new';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    retryAttempt: 0,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    const scopeName = this.props.scopeName || 'page';
    console.error(`ErrorBoundary caught an error in ${scopeName}.`, error, errorInfo?.componentStack);
  }

  handleRetry = () => {
    this.setState(({ retryAttempt }) => ({
      hasError: false,
      error: null,
      retryAttempt: retryAttempt + 1,
    }));

    if (typeof this.props.onRetry === 'function') {
      this.props.onRetry();
    }
  };

  renderFallback() {
    const reportIssueUrl = this.props.reportIssueUrl || DEFAULT_REPORT_ISSUE_URL;

    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4 py-10">
        <div
          role="alert"
          aria-live="assertive"
          className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive flex-shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                We could not load this section. Your data is safe. Try again or report the issue if it keeps happening.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
                <a
                  href={reportIssueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Report Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return <>{this.props.children}</>;
  }
}