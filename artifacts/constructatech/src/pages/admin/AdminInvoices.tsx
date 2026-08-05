import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListAdminInvoices,
  useCreateAdminInvoice,
  useUpdateAdminInvoice,
  useDeleteAdminInvoice,
  useListAdminCustomers,
  getListAdminInvoicesQueryKey,
} from '@workspace/api-client-react';
import { Loader2, Plus, X, Trash2, AlertTriangle } from 'lucide-react';

const STATUSES = ['draft', 'sent', 'paid', 'overdue'] as const;

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const EMPTY = {
  number: '',
  customerId: '',
  amount: '',
  currency: 'BWP',
  status: 'draft',
  issueDate: today(),
  dueDate: inDays(30),
};

export default function AdminInvoices() {
  const queryClient = useQueryClient();
  const { data: invoices, isLoading } = useListAdminInvoices();
  const { data: customers } = useListAdminCustomers();
  const createInvoice = useCreateAdminInvoice();
  const updateInvoice = useUpdateAdminInvoice();
  const deleteInvoice = useDeleteAdminInvoice();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListAdminInvoicesQueryKey() });
  const setField = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(EMPTY);
    createInvoice.reset();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice.mutate(
      {
        data: {
          number: form.number.trim(),
          customerId: Number(form.customerId),
          amount: Number(form.amount),
          currency: form.currency,
          status: form.status as never,
          issueDate: form.issueDate,
          dueDate: form.dueDate,
        },
      },
      { onSuccess: () => { closeForm(); refresh(); } },
    );
  };

  const changeStatus = (id: number, status: string) => {
    updateInvoice.mutate({ id, data: { status: status as never } }, { onSuccess: refresh });
  };

  const confirmDelete = (id: number) => {
    setDeleteError(null);
    deleteInvoice.mutate({ id }, {
      onSuccess: () => { setConfirmingId(null); refresh(); },
      onError: (err) => setDeleteError(err instanceof Error ? err.message : 'Could not delete the invoice.'),
    });
  };

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

  const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">All Invoices</h1>
          <p className="text-muted-foreground">Global view of billing and receivables.</p>
        </div>
        <button
          onClick={() => (isFormOpen ? closeForm() : setIsFormOpen(true))}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isFormOpen ? 'Cancel' : 'New Invoice'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">New invoice</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Invoice number</label>
              <input required value={form.number} onChange={(e) => setField('number', e.target.value)} placeholder="INV-0001" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Customer</label>
              <select required value={form.customerId} onChange={(e) => setField('customerId', e.target.value)} className={inputClass}>
                <option value="">Select a customer…</option>
                {customers?.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Amount</label>
              <input required type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setField('amount', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Currency</label>
              <input value={form.currency} onChange={(e) => setField('currency', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Issue date</label>
              <input required type="date" value={form.issueDate} onChange={(e) => setField('issueDate', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Due date</label>
              <input required type="date" value={form.dueDate} onChange={(e) => setField('dueDate', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {createInvoice.isError && (
            <p className="mt-4 text-sm font-medium text-destructive">
              {createInvoice.error instanceof Error ? createInvoice.error.message : 'Could not create the invoice.'}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={createInvoice.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
              {createInvoice.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create invoice
            </button>
            <button type="button" onClick={closeForm} className="rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </form>
      )}

      {deleteError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">{deleteError}</p>
      )}

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
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices?.map((inv) => (
                <React.Fragment key={inv.id}>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{inv.number}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.customerName || `CST-${inv.customerId}`}</td>
                    <td className="px-6 py-4 font-medium font-mono text-foreground">
                      {inv.currency} {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={inv.status} />
                        <select
                          value={inv.status}
                          onChange={(e) => changeStatus(inv.id, e.target.value)}
                          aria-label={`Change status of invoice ${inv.number}`}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setConfirmingId(inv.id); setDeleteError(null); }}
                        aria-label={`Delete invoice ${inv.number}`}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {confirmingId === inv.id && (
                    <tr>
                      <td colSpan={7} className="bg-destructive/5 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                          <span className="text-sm text-foreground">
                            Delete <strong>{inv.number}</strong> permanently?
                            {inv.status === 'paid' && ' Paid invoices are kept as accounting records and cannot be deleted.'}
                          </span>
                          <div className="ml-auto flex gap-2">
                            <button
                              onClick={() => confirmDelete(inv.id)}
                              disabled={deleteInvoice.isPending || inv.status === 'paid'}
                              className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                            >
                              {deleteInvoice.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                              Delete
                            </button>
                            <button onClick={() => setConfirmingId(null)} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!invoices?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
