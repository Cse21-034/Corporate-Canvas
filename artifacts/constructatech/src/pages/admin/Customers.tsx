import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListAdminCustomers,
  useCreateAdminCustomer,
  getListAdminCustomersQueryKey,
} from '@workspace/api-client-react';
import { Loader2, Mail, Phone, Plus, X, RefreshCw } from 'lucide-react';

const EMPTY_FORM = {
  companyName: '',
  contactName: '',
  email: '',
  password: '',
  phone: '',
};

function generatePassword(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => alphabet[n % alphabet.length]).join('');
}

export default function Customers() {
  const queryClient = useQueryClient();
  const { data: customers, isLoading } = useListAdminCustomers();
  const createCustomer = useCreateAdminCustomer();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  const setField = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(EMPTY_FORM);
    createCustomer.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer.mutate(
      { data: form },
      {
        onSuccess: () => {
          // Surface the credentials once — the password is never retrievable
          // afterwards, so staff have to pass it on now.
          setCreated({ email: form.email, password: form.password });
          setForm(EMPTY_FORM);
          setIsFormOpen(false);
          queryClient.invalidateQueries({ queryKey: getListAdminCustomersQueryKey() });
        },
      },
    );
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage client accounts and access.</p>
        </div>
        <button
          onClick={() => (isFormOpen ? closeForm() : setIsFormOpen(true))}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isFormOpen ? 'Cancel' : 'New Customer'}
        </button>
      </div>

      {created && (
        <div className="rounded-xl border border-green-600/30 bg-green-50 p-5 dark:bg-green-900/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">Account created</p>
              <p className="mt-1 text-sm text-green-900/80 dark:text-green-200/80">
                Send these credentials to the client. The password cannot be shown again.
              </p>
              <dl className="mt-3 space-y-1 font-mono-label text-sm text-foreground">
                <div><span className="text-muted-foreground">EMAIL </span>{created.email}</div>
                <div><span className="text-muted-foreground">PASSWORD </span>{created.password}</div>
              </dl>
            </div>
            <button onClick={() => setCreated(null)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">New client account</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Company name</label>
              <input required value={form.companyName} onChange={(e) => setField('companyName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Primary contact</label>
              <input required value={form.contactName} onChange={(e) => setField('contactName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
              <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Initial password</label>
              <div className="flex gap-2">
                <input
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className={inputClass}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setField('password', generatePassword())}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" /> Generate
                </button>
              </div>
            </div>
          </div>

          {createCustomer.isError && (
            <p className="mt-4 text-sm font-medium text-destructive">
              {createCustomer.error instanceof Error ? createCustomer.error.message : 'Could not create the account.'}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={createCustomer.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {createCustomer.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
            <button type="button" onClick={closeForm} className="rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-mono-label">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Primary Contact</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{customer.companyName}</div>
                    <div className="text-xs text-muted-foreground font-mono-label mt-1">ID: CST-{customer.id.toString().padStart(3, '0')}</div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{customer.contactName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {customer.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      customer.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-muted text-muted-foreground'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!customers?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
