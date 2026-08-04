import React, { useState, useRef, useEffect } from 'react';
import { useGetPortalTicket, getGetPortalTicketQueryKey, useAddTicketMessage } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function TicketDetail() {
  const { id } = useParams();
  const ticketId = parseInt(id || '0', 10);
  
  const queryClient = useQueryClient();
  const queryKey = getGetPortalTicketQueryKey(ticketId);
  
  const { data: ticket, isLoading, isError } = useGetPortalTicket(ticketId, {
    query: { enabled: !!ticketId, queryKey }
  });
  
  const addMessage = useAddTicketMessage();
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length]);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    addMessage.mutate({
      id: ticketId,
      data: { body: reply }
    }, {
      onSuccess: () => {
        setReply('');
        queryClient.invalidateQueries({ queryKey });
      }
    });
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (isError || !ticket) {
    return <div className="p-8 text-center text-destructive">Ticket not found.</div>;
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="shrink-0">
        <Link href="/portal/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </Link>
        
        <div className="bg-card border border-border p-6 rounded-t-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-label text-muted-foreground">TKT-{ticket.id.toString().padStart(4, '0')}</span>
                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold uppercase">{ticket.status}</span>
                <span className="px-2 py-0.5 rounded border border-border text-[10px] font-bold uppercase">{ticket.priority}</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">{ticket.subject}</h1>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              Opened on {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 bg-muted/30 border border-border overflow-y-auto p-6 space-y-6">
        {ticket.messages.map((msg) => {
          const isStaff = msg.isStaff;
          return (
            <div key={msg.id} className={`flex flex-col ${isStaff ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-medium text-foreground">{msg.author}</span>
                {isStaff && <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">STAFF</span>}
                <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                isStaff 
                  ? 'bg-card border border-border rounded-tl-sm text-foreground shadow-sm' 
                  : 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      {ticket.status !== 'closed' ? (
        <div className="shrink-0 bg-card border border-border p-4 rounded-b-xl shadow-sm">
          <form onSubmit={handleSubmitReply} className="flex gap-4">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              className="flex-1 p-3 min-h-[50px] max-h-[150px] rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitReply(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={addMessage.isPending || !reply.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-md font-bold transition-all disabled:opacity-70 self-end flex items-center justify-center shrink-0 w-[60px] h-[50px]"
            >
              {addMessage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      ) : (
        <div className="shrink-0 bg-muted border border-border p-4 rounded-b-xl text-center text-muted-foreground text-sm">
          This ticket is closed and cannot receive new replies.
        </div>
      )}
    </div>
  );
}
