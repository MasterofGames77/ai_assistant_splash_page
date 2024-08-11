import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkFrontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Publishable Key");
}

console.log('Clerk Publishable Key:', clerkFrontendApi);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkFrontendApi}>
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);