import React, { useState } from 'react';
import { useCreatePortalTicket, useListPortalProjects, TicketInputType, TicketInputPriority } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function NewTicket() {
  const [, setLocation] = useLocation();
  const createTicket = useCreatePortalTicket();
  const { data: projects } = useListPortalProjects();

  const [formData, setFormData] = useState({
    subject: '',
    type: 'support' as TicketInputType,
    priority: 'medium' as TicketInputPriority,
    projectId: '',
    body: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate({
      data: {
        subject: formData.subject,
        type: formData.type,
        priority: formData.priority,
        projectId: formData.projectId ? parseInt(formData.projectId, 10) : undefined,
        body: formData.body
      }
    }, {
      onSuccess: (ticket) => {
        setLocation(`/portal/tickets/${ticket.id}`);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/portal/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Tickets
      </Link>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">Create New Ticket</h1>
          <p className="text-muted-foreground">Describe your issue or request below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subject <span className="text-destructive">*</span></label>
            <input 
              required 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              placeholder="Brief summary of the issue"
              className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="support">Support / Issue</option>
                <option value="change-request">Change Request</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {projects && projects.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Related Project (Optional)</label>
              <select 
                name="projectId" 
                value={formData.projectId} 
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">-- None --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message <span className="text-destructive">*</span></label>
            <textarea 
              required 
              name="body" 
              value={formData.body} 
              onChange={handleChange} 
              rows={8}
              placeholder="Please provide as much detail as possible..."
              className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y min-h-[150px]" 
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Link 
              href="/portal/tickets"
              className="px-4 py-2 border border-input rounded-md text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={createTicket.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {createTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
            </button>
          </div>
          
          {createTicket.isError && (
            <p className="text-sm text-destructive text-right">Error creating ticket. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
