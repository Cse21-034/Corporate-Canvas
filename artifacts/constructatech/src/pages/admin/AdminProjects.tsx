import React, { useState } from 'react';
import { useListAdminProjects, useListAdminCustomers, useCreateAdminProject, useUpdateAdminProject, useDeleteAdminProject, useCreateAdminProjectMessage, getListAdminProjectsQueryKey, ProjectInputStatus } from '@workspace/api-client-react';
import { Loader2, Plus, X, Trash2, AlertTriangle, Send, MessageSquare } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProjects() {
  const { data: projects, isLoading } = useListAdminProjects();
  const { data: customers } = useListAdminCustomers();
  const createProject = useCreateAdminProject();
  const updateProject = useUpdateAdminProject();
  const deleteProject = useDeleteAdminProject();
  const sendMessage = useCreateAdminProjectMessage();
  const queryClient = useQueryClient();

  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [detached, setDetached] = useState<string | null>(null);

  // Client conversation, scoped to one project at a time. Reuses the same
  // append-only message pattern already built for tickets.
  const [messagingId, setMessagingId] = useState<number | null>(null);
  const [reply, setReply] = useState('');

  const openMessages = (id: number) => {
    setMessagingId(id);
    setPlanningId(null);
    setConfirmingId(null);
    setRowError(null);
    setReply('');
  };

  const submitReply = (id: number) => {
    if (reply.trim() === '') return;
    sendMessage.mutate(
      { id, data: { body: reply.trim() } },
      {
        onSuccess: () => {
          setReply('');
          refreshProjects();
        },
      },
    );
  };

  // Milestone editing. Staff own the delivery plan; the portal shows it to
  // customers read-only.
  const [planningId, setPlanningId] = useState<number | null>(null);
  const [plan, setPlan] = useState<Array<{ label: string; dueDate?: string | null; done: boolean }>>([]);

  const openPlan = (id: number, milestones: Array<{ label: string; dueDate?: string | null; done: boolean }>) => {
    setPlanningId(id);
    setMessagingId(null);
    setConfirmingId(null);
    setRowError(null);
    setPlan(milestones?.map((m) => ({ label: m.label, dueDate: m.dueDate ?? '', done: m.done })) ?? []);
  };

  const savePlan = (id: number) => {
    const cleaned = plan
      .filter((m) => m.label.trim() !== '')
      .map((m) => ({ label: m.label.trim(), dueDate: m.dueDate ? m.dueDate : null, done: m.done }));
    setRowError(null);
    updateProject.mutate({ id, data: { milestones: cleaned } }, {
      onSuccess: () => { setPlanningId(null); refreshProjects(); },
      onError: (err) => setRowError(err instanceof Error ? err.message : 'Could not save the milestones.'),
    });
  };

  const refreshProjects = () => queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });

  const changeStatus = (id: number, status: string) => {
    setRowError(null);
    updateProject.mutate({ id, data: { status: status as ProjectInputStatus } }, {
      onSuccess: refreshProjects,
      onError: (err) => setRowError(err instanceof Error ? err.message : 'Could not update the project.'),
    });
  };

  const confirmDelete = (id: number) => {
    setRowError(null);
    deleteProject.mutate({ id }, {
      onSuccess: (result) => {
        setConfirmingId(null);
        // Tickets and invoices survive the project — say so, so nobody
        // assumes they were deleted too.
        const t = result?.detachedTickets ?? 0;
        const i = result?.detachedInvoices ?? 0;
        setDetached(t || i ? `Project deleted. ${t} ticket(s) and ${i} invoice(s) were kept and detached from it.` : null);
        refreshProjects();
      },
      onError: (err) => setRowError(err instanceof Error ? err.message : 'Could not delete the project.'),
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    status: 'scoping' as ProjectInputStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return;

    createProject.mutate({
      data: {
        title: formData.title,
        description: formData.description,
        customerId: parseInt(formData.customerId, 10),
        status: formData.status
      }
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', customerId: '', status: 'scoping' });
        queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scoping': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'in-progress': return 'bg-primary/20 text-primary';
      case 'on-hold': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage all client infrastructure deployments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {detached && (
        <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm text-foreground">{detached}</p>
          <button onClick={() => setDetached(null)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-mono-label">
              <tr>
                <th className="px-6 py-4">Project ID & Title</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects?.map((project) => {
                const totalM = project.milestones?.length || 0;
                const doneM = project.milestones?.filter(m => m.done).length || 0;
                const pct = totalM === 0 ? 0 : Math.round((doneM / totalM) * 100);

                return (
                  <React.Fragment key={project.id}>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{project.title}</div>
                      <div className="text-xs text-muted-foreground font-mono-label mt-1">PRJ-{project.id.toString().padStart(4, '0')}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{project.customerName || `Customer #${project.customerId}`}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                        <select
                          value={project.status}
                          onChange={(e) => changeStatus(project.id, e.target.value)}
                          aria-label={`Change status of ${project.title}`}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {['scoping', 'in-progress', 'on-hold', 'completed'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => (planningId === project.id ? setPlanningId(null) : openPlan(project.id, project.milestones ?? []))}
                        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        Milestones
                      </button>
                      <button
                        onClick={() => (messagingId === project.id ? setMessagingId(null) : openMessages(project.id))}
                        className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Messages
                        {(project.messages?.length ?? 0) > 0 && (
                          <span className="rounded-full bg-primary/15 px-1.5 text-xs font-bold text-primary">
                            {project.messages!.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => { setConfirmingId(project.id); setMessagingId(null); setRowError(null); setDetached(null); }}
                        aria-label={`Delete ${project.title}`}
                        className="ml-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>

                  {planningId === project.id && (
                    <tr>
                      <td colSpan={6} className="bg-muted/20 px-6 py-5">
                        <h3 className="mb-3 font-mono-label text-xs text-muted-foreground">DELIVERY PLAN</h3>

                        <div className="space-y-2">
                          {plan.map((m, idx) => (
                            <div key={idx} className="flex flex-wrap items-center gap-2">
                              <input
                                type="checkbox"
                                checked={m.done}
                                onChange={(e) => setPlan(plan.map((x, i) => (i === idx ? { ...x, done: e.target.checked } : x)))}
                                aria-label={`Mark ${m.label || 'milestone'} complete`}
                                className="h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
                              />
                              <input
                                value={m.label}
                                onChange={(e) => setPlan(plan.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)))}
                                placeholder="Milestone"
                                className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <input
                                type="date"
                                value={m.dueDate ?? ''}
                                onChange={(e) => setPlan(plan.map((x, i) => (i === idx ? { ...x, dueDate: e.target.value } : x)))}
                                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <button
                                onClick={() => setPlan(plan.filter((_, i) => i !== idx))}
                                aria-label={`Remove ${m.label || 'milestone'}`}
                                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {plan.length === 0 && (
                            <p className="text-sm text-muted-foreground">No milestones yet. Add the first step below.</p>
                          )}
                        </div>

                        {rowError && <p className="mt-3 text-sm font-medium text-destructive">{rowError}</p>}

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => setPlan([...plan, { label: '', dueDate: '', done: false }])}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            <Plus className="h-4 w-4" /> Add milestone
                          </button>
                          <button
                            onClick={() => savePlan(project.id)}
                            disabled={updateProject.isPending}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                          >
                            {updateProject.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save plan
                          </button>
                          <button onClick={() => setPlanningId(null)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {messagingId === project.id && (
                    <tr>
                      <td colSpan={6} className="bg-muted/20 px-6 py-5">
                        <h3 className="mb-3 font-mono-label text-xs text-muted-foreground">
                          CONVERSATION WITH {project.customerName ?? `CUSTOMER #${project.customerId}`}
                        </h3>

                        <div className="max-h-80 space-y-3 overflow-y-auto">
                          {(!project.messages || project.messages.length === 0) && (
                            <p className="text-sm text-muted-foreground">No messages yet.</p>
                          )}
                          {project.messages?.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-lg border p-3 ${
                                msg.isStaff ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                              }`}>
                                <div className="mb-1 flex items-baseline gap-2">
                                  <span className="text-xs font-bold text-foreground">{msg.author}</span>
                                  {msg.isStaff && <span className="font-mono-label text-[10px] text-primary">STAFF</span>}
                                  <span className="text-[11px] text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm text-card-foreground/90">{msg.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {sendMessage.isError && (
                          <p className="mt-3 text-sm font-medium text-destructive">
                            {sendMessage.error instanceof Error ? sendMessage.error.message : 'Could not send the message.'}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-start gap-2">
                          <textarea
                            rows={2}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Reply to the client…"
                            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={() => submitReply(project.id)}
                            disabled={sendMessage.isPending || reply.trim() === ''}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                          >
                            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send
                          </button>
                          <button onClick={() => setMessagingId(null)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {confirmingId === project.id && (
                    <tr>
                      <td colSpan={6} className="bg-destructive/5 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                          <span className="text-sm text-foreground">
                            Delete <strong>{project.title}</strong>? Its tickets and invoices are kept and detached from the project.
                          </span>
                          <div className="ml-auto flex gap-2">
                            <button
                              onClick={() => confirmDelete(project.id)}
                              disabled={deleteProject.isPending}
                              className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
                            >
                              {deleteProject.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                              Delete
                            </button>
                            <button onClick={() => setConfirmingId(null)} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                          </div>
                        </div>
                        {rowError && <p className="mt-3 text-sm font-medium text-destructive">{rowError}</p>}
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              })}
              {!projects?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-xl">
              <h2 className="font-display font-bold text-xl">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Client <span className="text-destructive">*</span></label>
                  <select 
                    required 
                    value={formData.customerId}
                    onChange={(e) => setFormData(p => ({ ...p, customerId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Select a client...</option>
                    {customers?.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName} ({c.contactName})</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Project Title <span className="text-destructive">*</span></label>
                  <input 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description <span className="text-destructive">*</span></label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Initial Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as ProjectInputStatus }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="scoping">Scoping</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/10 rounded-b-xl">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-input rounded-md font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="create-project-form"
                disabled={createProject.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-bold transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {createProject.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
