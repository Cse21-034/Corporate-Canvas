import React, { useState } from 'react';
import { useListPortalTickets, getListPortalTicketsQueryKey } from '@workspace/api-client-react';
import { Loader2, Plus, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

export default function Tickets() {
  const [filter, setFilter] = useState<string>('all');
  const { data: tickets, isLoading } = useListPortalTickets(
    filter !== 'all' ? { status: filter } : undefined,
    { query: { queryKey: getListPortalTicketsQueryKey(filter !== 'all' ? { status: filter } : undefined) } }
  );

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'open': return <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase">Open</span>;
      case 'in-progress': return <span className="px-2.5 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold uppercase">In Progress</span>;
      case 'resolved': return <span className="px-2.5 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase">Resolved</span>;
      case 'closed': return <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-bold uppercase">Closed</span>;
      default: return null;
    }
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    switch (priority) {
      case 'urgent': return <span className="px-2 py-0.5 rounded border border-red-500/50 text-red-500 text-[10px] font-bold uppercase">Urgent</span>;
      case 'high': return <span className="px-2 py-0.5 rounded border border-orange-500/50 text-orange-500 text-[10px] font-bold uppercase">High</span>;
      case 'medium': return <span className="px-2 py-0.5 rounded border border-blue-500/50 text-blue-500 text-[10px] font-bold uppercase">Medium</span>;
      case 'low': return <span className="px-2 py-0.5 rounded border border-muted-foreground/50 text-muted-foreground text-[10px] font-bold uppercase">Low</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">Manage your support requests and issues.</p>
        </div>
        <Link 
          href="/portal/tickets/new" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Ticket
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-foreground text-background shadow-sm' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : !tickets?.length ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold">No tickets found</h3>
            <p className="text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/portal/tickets/${ticket.id}`}
                className="block p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono-label text-muted-foreground">TKT-{ticket.id.toString().padStart(4, '0')}</span>
                      <PriorityBadge priority={ticket.priority} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">{ticket.type.replace('-', ' ')}</span>
                    </div>
                    <h3 className="text-foreground font-medium truncate">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <StatusBadge status={ticket.status} />
                    <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
