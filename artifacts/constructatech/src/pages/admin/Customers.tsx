import React from 'react';
import { useListAdminCustomers } from '@workspace/api-client-react';
import { Loader2, Mail, Phone } from 'lucide-react';

export default function Customers() {
  const { data: customers, isLoading } = useListAdminCustomers();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground">Manage client accounts and access.</p>
      </div>

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
