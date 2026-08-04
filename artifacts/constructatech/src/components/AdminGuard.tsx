import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Redirect, Link } from 'wouter';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isLoading, isLoggedIn, isStaff } = useAuth();

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

  if (!isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Access Restricted</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You do not have permission to view the administrative portal. If you believe this is an error, please contact IT support.
        </p>
        <Link href="/portal" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors">
          Return to Client Portal
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
