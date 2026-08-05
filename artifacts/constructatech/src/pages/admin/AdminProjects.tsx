import React, { useState } from 'react';
import { useListAdminProjects, useListAdminCustomers, useCreateAdminProject, useUpdateAdminProject, useDeleteAdminProject, getListAdminProjectsQueryKey, ProjectInputStatus } from '@workspace/api-client-react';
import { Loader2, Plus, X, Trash2, AlertTriangle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProjects() {
  const { data: projects, isLoading } = useListAdminProjects();
  const { data: customers } = useListAdminCustomers();
  const createProject = useCreateAdminProject();
  const updateProject = useUpdateAdminProject();
  const deleteProject = useDeleteAdminProject();
  const queryClient = useQueryClient();

  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [detached, setDetached] = useState<string | null>(null);

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
                        onClick={() => { setConfirmingId(project.id); setRowError(null); setDetached(null); }}
                        aria-label={`Delete ${project.title}`}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>

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
