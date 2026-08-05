import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListServices,
  useUpdateAdminService,
  getListServicesQueryKey,
} from '@workspace/api-client-react';
import { Loader2, ImageOff, Check } from 'lucide-react';

export default function Services() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useListServices();
  const updateService = useUpdateAdminService();

  // Which row is being edited, and the draft value for it.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [savedId, setSavedId] = useState<number | null>(null);

  const startEditing = (id: number, current: string | null | undefined) => {
    setEditingId(id);
    setDraft(current ?? '');
    setSavedId(null);
    updateService.reset();
  };

  const save = (id: number) => {
    updateService.mutate(
      { id, data: { imageUrl: draft.trim() === '' ? null : draft.trim() } },
      {
        onSuccess: () => {
          setEditingId(null);
          setSavedId(id);
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        },
      },
    );
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground">
          Set the image shown on each service card. Paste an https URL, or clear the field to fall back to the icon treatment.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {services?.map((service) => {
          const isEditing = editingId === service.id;
          return (
            <div key={service.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative aspect-[16/9] bg-muted">
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="h-6 w-6" />
                    <span className="font-mono-label text-xs">NO IMAGE SET</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-bold text-card-foreground">{service.title}</h2>
                  {savedId === service.id && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
                      <Check className="h-3.5 w-3.5" /> Saved
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {updateService.isError && (
                      <p className="text-sm font-medium text-destructive">
                        {updateService.error instanceof Error ? updateService.error.message : 'Could not save.'}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => save(service.id)}
                        disabled={updateService.isPending}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                      >
                        {updateService.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate font-mono-label text-xs text-muted-foreground" title={service.imageUrl ?? ''}>
                      {service.imageUrl ?? 'NO IMAGE'}
                    </p>
                    <button
                      onClick={() => startEditing(service.id, service.imageUrl)}
                      className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {service.imageUrl ? 'Change' : 'Add image'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
