import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetAdminTicket,
  useUpdateAdminTicket,
  useCreateAdminTicketMessage,
  useDeleteAdminTicket,
  getGetAdminTicketQueryKey,
  getListAdminTicketsQueryKey,
} from '@workspace/api-client-react';
import { Loader2, ArrowLeft, Send, Trash2, AlertTriangle } from 'lucide-react';

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'] as const;
const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  closed: 'bg-muted text-muted-foreground',
};

export default function AdminTicketDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const { data: ticket, isLoading, isError } = useGetAdminTicket(id);
  const updateTicket = useUpdateAdminTicket();
  const sendReply = useCreateAdminTicketMessage();
  const deleteTicket = useDeleteAdminTicket();

  const [reply, setReply] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetAdminTicketQueryKey(id) });
    queryClient.invalidateQueries({ queryKey: getListAdminTicketsQueryKey() });
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim() === '') return;
    sendReply.mutate(
      { id, data: { body: reply.trim() } },
      { onSuccess: () => { setReply(''); refresh(); } },
    );
  };

  const changeField = (field: 'status' | 'priority', value: string) => {
    updateTicket.mutate({ id, data: { [field]: value } as never }, { onSuccess: refresh });
  };

  const confirmDelete = () => {
    deleteTicket.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminTicketsQueryKey() });
        setLocation('/admin/tickets');
      },
    });
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-4">
        <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
        <p className="text-destructive">That ticket could not be loaded. It may have been deleted.</p>
      </div>
    );
  }

  const messages = ticket.messages ?? [];
  const selectClass = 'rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-6">
      <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tickets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="font-mono-label text-xs text-muted-foreground">TKT-{String(ticket.id).padStart(4, '0')}</span>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ticket.customerName ?? 'Unknown customer'} · {ticket.type}
          </p>
        </div>
        <span className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase ${STATUS_STYLES[ticket.status] ?? 'bg-muted text-muted-foreground'}`}>
          {ticket.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          Status
          <select value={ticket.status} onChange={(e) => changeField('status', e.target.value)} className={selectClass}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          Priority
          <select value={ticket.priority} onChange={(e) => changeField('priority', e.target.value)} className={selectClass}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        {updateTicket.isPending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}

        <button
          onClick={() => setConfirmingDelete(true)}
          className="ml-auto inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>

      {confirmingDelete && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-3">
              <div>
                <p className="font-bold text-foreground">Delete this ticket?</p>
                <p className="text-sm text-muted-foreground">
                  The ticket and its {messages.length} message{messages.length === 1 ? '' : 's'} are removed permanently. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  disabled={deleteTicket.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
                >
                  {deleteTicket.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete permanently
                </button>
                <button onClick={() => setConfirmingDelete(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-mono-label text-xs text-muted-foreground">CONVERSATION</h2>

        {messages.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl border p-4 ${
              msg.isStaff ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
            }`}>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-sm font-bold text-foreground">{msg.author}</span>
                {msg.isStaff && <span className="font-mono-label text-[10px] text-primary">STAFF</span>}
                <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-card-foreground/90">{msg.body}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submitReply} className="space-y-3 rounded-xl border border-border bg-card p-5">
        <label htmlFor="reply" className="block text-sm font-semibold text-foreground">Reply to the customer</label>
        <textarea
          id="reply"
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your response…"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {sendReply.isError && (
          <p className="text-sm font-medium text-destructive">
            {sendReply.error instanceof Error ? sendReply.error.message : 'Could not send the reply.'}
          </p>
        )}
        <button
          type="submit"
          disabled={sendReply.isPending || reply.trim() === ''}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {sendReply.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send reply
        </button>
      </form>
    </div>
  );
}
