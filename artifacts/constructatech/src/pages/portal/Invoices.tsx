import React from 'react';
import { useListPortalInvoices } from '@workspace/api-client-react';
import { Loader2, Receipt, Download } from 'lucide-react';

export default function Invoices() {
  const { data: invoices, isLoading } = useListPortalInvoices();

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'draft': return <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-bold uppercase">Draft</span>;
      case 'sent': return <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase">Unpaid</span>;
      case 'paid': return <span className="px-2.5 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase">Paid</span>;
      case 'overdue': return <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold uppercase">Overdue</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Invoices</h1>
        <p className="text-muted-foreground">View and manage your billing history.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : !invoices?.length ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold">No Invoices</h3>
            <p className="text-muted-foreground">You don't have any billing history yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-mono-label">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Date Issued</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{inv.number}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium font-mono">
                      {inv.currency} {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors p-2 hover:bg-primary/5 rounded-md">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
