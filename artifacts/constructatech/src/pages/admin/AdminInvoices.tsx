import React from 'react';
import { useListAdminInvoices } from '@workspace/api-client-react';
import { Loader2 } from 'lucide-react';

export default function AdminInvoices() {
  const { data: invoices, isLoading } = useListAdminInvoices();

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'draft': return <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-bold uppercase">Draft</span>;
      case 'sent': return <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase">Unpaid</span>;
      case 'paid': return <span className="px-2.5 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase">Paid</span>;
      case 'overdue': return <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold uppercase">Overdue</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">All Invoices</h1>
        <p className="text-muted-foreground">Global view of billing and receivables.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-mono-label">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices?.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{inv.number}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.customerName || `CST-${inv.customerId}`}</td>
                  <td className="px-6 py-4 font-medium font-mono text-foreground">
                    {inv.currency} {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(inv.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {!invoices?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
