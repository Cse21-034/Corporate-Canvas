import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

export function PortalGuard({ children }: { children: ReactNode }) {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Redirect to="/portal/login" />;
  }

  return <>{children}</>;
}
