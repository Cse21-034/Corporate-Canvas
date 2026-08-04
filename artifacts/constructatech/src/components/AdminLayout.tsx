import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from './Logo';
import { LayoutDashboard, FileText, Users, FolderKanban, MessageSquare, Receipt, LogOut, ArrowLeft } from 'lucide-react';
import { useLogout } from '@workspace/api-client-react';

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const logout = useLogout();

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/quotes', label: 'Quote Requests', icon: FileText },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/tickets', label: 'Tickets', icon: MessageSquare },
    { href: '/admin/invoices', label: 'Invoices', icon: Receipt },
  ];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/portal/login';
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 pb-2 border-b border-sidebar-border/50">
          <Link href="/">
            <Logo variant="light" size="sm" />
          </Link>
          <div className="mt-4 px-2 flex items-center justify-between">
            <span className="font-mono-label text-primary">Admin Access</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border/50 space-y-1">
          <Link 
            href="/portal"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
          >
            <ArrowLeft className="w-5 h-5" />
            Client View
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm text-sidebar-foreground/70 hover:text-destructive hover:bg-sidebar-accent w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <div className="md:hidden bg-sidebar p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Logo variant="light" size="sm" />
            <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold ml-2">ADMIN</span>
          </div>
          <button onClick={handleLogout} className="text-sidebar-foreground/70 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around p-2 pb-safe z-30">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== '/admin');
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 min-w-[64px] ${
                isActive ? 'text-primary' : 'text-sidebar-foreground/70'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
