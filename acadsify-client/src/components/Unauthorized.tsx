import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">Unauthorized Access</h1>
      <p className="mb-4 text-muted-foreground text-center max-w-md">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
}
