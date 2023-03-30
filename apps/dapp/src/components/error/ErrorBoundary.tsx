import type { ErrorInfo } from 'react';
import React from 'react';

import { Alert, AlertTitle, Box } from '@mui/material';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; message?: string },
  { error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(
    props:
      | { children: React.ReactNode }
      | Readonly<{ children: React.ReactNode }>
  ) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  override componentDidCatch?(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error, errorInfo });
    // You can also log error messages to an error reporting service here
  }

  override render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="bg-[url('/images/misc/share-bg.png')] h-screen w-screen bg-contain bg-no-repeat">
          <Box className="flex justify-center items-center h-screen w-96 mx-auto">
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {this.state.error && this.state.error.toString()}
            </Alert>
          </Box>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
