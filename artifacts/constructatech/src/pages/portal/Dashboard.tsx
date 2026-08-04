import React from 'react';
import { useGetPortalDashboard, useGetMe } from '@workspace/api-client-react';
import { Loader2, FolderKanban, MessageSquare, Receipt, Activity as ActivityIcon } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: me } = useGetMe();
  const { data: dashboard, isLoading } = useGetPortalDashboard();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {me?.name}</h1>
        <p className="text-muted-foreground">{me?.companyName || 'Constructatech Ventures Portal'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">ACTIVE PROJECTS</span>
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <span className="text-4xl font-display font-bold">{dashboard?.activeProjects || 0}</span>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">OPEN TICKETS</span>
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <span className="text-4xl font-display font-bold">{dashboard?.openTickets || 0}</span>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">UNPAID INVOICES</span>
            <Receipt className="w-5 h-5 text-destructive" />
          </div>
          <span className="text-4xl font-display font-bold">{dashboard?.unpaidInvoices || 0}</span>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">OUTSTANDING</span>
            <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">BWP</span>
          </div>
          <span className="text-4xl font-display font-bold">{dashboard?.totalInvoiceAmount ? dashboard.totalInvoiceAmount.toLocaleString() : '0.00'}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="font-display font-bold text-lg">Recent Activity</h2>
          <ActivityIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border">
          {dashboard?.recentActivity?.length ? dashboard.recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No recent activity found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
