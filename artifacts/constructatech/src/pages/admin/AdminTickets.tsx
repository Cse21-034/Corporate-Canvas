import React from 'react';
import { Link } from 'wouter';
import { useListAdminTickets } from '@workspace/api-client-react';
import { Loader2 } from 'lucide-react';

export default function AdminTickets() {
  const { data: tickets, isLoading } = useListAdminTickets();

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'open': return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-bold uppercase">Open</span>;
      case 'in-progress': return <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 text-[10px] font-bold uppercase">In Progress</span>;
      case 'resolved': return <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[10px] font-bold uppercase">Resolved</span>;
      case 'closed': return <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-bold uppercase">Closed</span>;
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

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">All Tickets</h1>
        <p className="text-muted-foreground">Global view of client support and change requests.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-mono-label">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status & Priority</th>
                <th className="px-6 py-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets?.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/tickets/${ticket.id}`} className="font-medium text-foreground mb-1 block hover:text-primary transition-colors">
                      {ticket.subject}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono-label">TKT-{ticket.id.toString().padStart(4, '0')}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">{ticket.type.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">
                    {ticket.customerName || `Customer #${ticket.customerId}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {ticket.messages?.[ticket.messages.length - 1] 
                      ? new Date(ticket.messages[ticket.messages.length - 1].createdAt).toLocaleString() 
                      : new Date(ticket.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!tickets?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
