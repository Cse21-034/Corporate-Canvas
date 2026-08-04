import React from 'react';
import { useListAdminCustomers, useListAdminProjects, useListAdminTickets, useListAdminQuoteRequests } from '@workspace/api-client-react';
import { Loader2, Users, FolderKanban, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminDashboard() {
  const { data: customers } = useListAdminCustomers();
  const { data: projects } = useListAdminProjects();
  const { data: tickets } = useListAdminTickets();
  const { data: quotes, isLoading } = useListAdminQuoteRequests();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  const activeProjects = projects?.filter(p => p.status === 'scoping' || p.status === 'in-progress').length || 0;
  const openTickets = tickets?.filter(t => t.status === 'open' || t.status === 'in-progress').length || 0;
  const newQuotes = quotes?.filter(q => q.status === 'new').length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">High-level operations command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">TOTAL CUSTOMERS</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-4xl font-display font-bold">{customers?.length || 0}</span>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">ACTIVE PROJECTS</span>
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <span className="text-4xl font-display font-bold">{activeProjects}</span>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">OPEN TICKETS</span>
            <MessageSquare className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-4xl font-display font-bold">{openTickets}</span>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm relative overflow-hidden">
          {newQuotes > 0 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
          )}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-label text-muted-foreground">NEW QUOTES</span>
            <FileText className={`w-5 h-5 ${newQuotes > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <span className="text-4xl font-display font-bold">{newQuotes}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="font-display font-bold text-lg">Recent Quote Requests</h2>
          <Link href="/admin/quotes" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/20 text-muted-foreground font-mono-label border-b border-border">
              <tr>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes?.slice(0, 5).map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">{quote.company}</td>
                  <td className="px-6 py-3 text-muted-foreground">{quote.name}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      quote.status === 'new' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{new Date(quote.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!quotes?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No recent quote requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
