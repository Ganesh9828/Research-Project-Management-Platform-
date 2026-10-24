import React from 'react';

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
      <span className="ml-4 text-xl font-semibold">Loading...</span>
    </div>
  );
}
