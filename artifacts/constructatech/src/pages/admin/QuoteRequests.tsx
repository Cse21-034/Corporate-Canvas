import React from 'react';
import { useListAdminQuoteRequests, useUpdateAdminQuoteRequest, getListAdminQuoteRequestsQueryKey, QuoteRequestUpdateStatus } from '@workspace/api-client-react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function QuoteRequests() {
  const { data: quotes, isLoading } = useListAdminQuoteRequests();
  const updateQuote = useUpdateAdminQuoteRequest();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateQuote.mutate({
      id,
      data: { status: newStatus as QuoteRequestUpdateStatus }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminQuoteRequestsQueryKey() });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-primary/20 text-primary';
      case 'contacted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'quoted': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      case 'won': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      case 'lost': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Quote Requests</h1>
        <p className="text-muted-foreground">Manage incoming sales inquiries.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-mono-label">
              <tr>
                <th className="px-6 py-4">Company & Contact</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 w-1/3">Message & Interests</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes?.map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <p className="font-bold text-foreground">{quote.company}</p>
                    <p className="text-muted-foreground">{quote.name}</p>
                    {quote.industry && <p className="text-xs font-mono-label mt-1 opacity-60">{quote.industry}</p>}
                  </td>
                  <td className="px-6 py-4 align-top text-muted-foreground">
                    <p>{quote.email}</p>
                    <p>{quote.phone}</p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="text-foreground/80 line-clamp-3 mb-2" title={quote.message}>{quote.message}</p>
                    <div className="flex flex-wrap gap-1">
                      {quote.serviceInterest?.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-muted rounded text-[10px] uppercase">{s.replace('-', ' ')}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      className={`text-xs font-bold uppercase rounded px-2 py-1 border-none focus:ring-2 focus:ring-primary cursor-pointer outline-none ${getStatusColor(quote.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 align-top text-muted-foreground whitespace-nowrap">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!quotes?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No quote requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
