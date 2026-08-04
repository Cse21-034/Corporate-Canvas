import React, { useState, useEffect } from 'react';
import { useGetPortalAccount, useUpdatePortalAccount, getGetPortalAccountQueryKey } from '@workspace/api-client-react';
import { Loader2, Save } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Account() {
  const { data: account, isLoading } = useGetPortalAccount();
  const updateAccount = useUpdatePortalAccount();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: ''
  });

  useEffect(() => {
    if (account) {
      setFormData({
        companyName: account.companyName || '',
        contactName: account.contactName || '',
        phone: account.phone || ''
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccount.mutate({
      data: formData
    }, {
      onSuccess: (data) => {
        // Update cache locally instead of invalidating to prevent jumpiness
        queryClient.setQueryData(getGetPortalAccountQueryKey(), (old: any) => 
          old ? { ...old, ...data } : old
        );
      }
    });
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">Manage your company profile and contact details.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-lg">Company Profile</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address (Read-only)</label>
              <input 
                disabled 
                value={account?.email || ''} 
                className="w-full h-10 px-3 rounded-md border border-input bg-muted text-muted-foreground opacity-70 cursor-not-allowed" 
              />
              <p className="text-xs text-muted-foreground">Contact support to change your primary account email.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input 
                name="companyName" 
                value={formData.companyName} 
                onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))} 
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Primary Contact Name</label>
              <input 
                name="contactName" 
                value={formData.contactName} 
                onChange={(e) => setFormData(p => ({ ...p, contactName: e.target.value }))} 
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} 
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              {updateAccount.isSuccess && (
                <span className="text-sm text-green-600 font-medium">Settings saved successfully.</span>
              )}
              {updateAccount.isError && (
                <span className="text-sm text-destructive font-medium">Failed to save settings.</span>
              )}
              {!updateAccount.isSuccess && !updateAccount.isError && <span />}
              
              <button 
                type="submit" 
                disabled={updateAccount.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-bold transition-all disabled:opacity-70 flex items-center gap-2 ml-auto"
              >
                {updateAccount.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-lg text-destructive">Security</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">To change your password, please contact the IT support team directly or use the forgot password link on the login page.</p>
          <button disabled className="px-4 py-2 border border-input rounded-md text-foreground/50 font-medium bg-muted cursor-not-allowed text-sm">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
