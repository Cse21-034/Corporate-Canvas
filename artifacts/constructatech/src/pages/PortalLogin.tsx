import React, { useState, useEffect } from 'react';
import { useLogin, useGetMe } from '@workspace/api-client-react';
import { Logo } from '../components/Logo';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function PortalLogin() {
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const loginMutation = useLogin();
  
  const [role, setRole] = useState<'customer' | 'staff'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation(user.role === 'customer' ? '/portal' : '/admin');
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      data: { email, password, role }
    }, {
      onSuccess: (res) => {
        setLocation(res.role === 'customer' ? '/portal' : '/admin');
      }
    });
  };

  // The form renders straight away rather than waiting on the session check.
  // Visitors reaching this page are almost always logged out, so blocking on
  // /auth/me made them sit through the whole round trip — including the API's
  // cold start — before they could type anything. Anyone who does turn out to
  // have a session is redirected by the effect above once it resolves.

  return (
    <div className="min-h-screen bg-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
        <Logo variant="light" size="lg" />
        <h2 className="mt-8 text-center text-3xl font-display font-bold text-white tracking-tight">
          System Access
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card border border-border py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
          
          <div className="flex p-1 bg-muted rounded-lg mb-8">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setRole('customer')}
            >
              Client Portal
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'staff' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setRole('staff')}
            >
              Staff Login
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-background"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-input rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
              >
                {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
            
            {loginMutation.isError && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                Invalid credentials. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
