import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetPortalProject,
  useCreatePortalProjectMessage,
  getGetPortalProjectQueryKey,
} from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Loader2, ArrowLeft, CheckCircle2, Circle, Calendar, Target, Send } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = parseInt(id || '0', 10);
  const queryClient = useQueryClient();
  const { data: project, isLoading, isError } = useGetPortalProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetPortalProjectQueryKey(projectId) }
  });
  const sendMessage = useCreatePortalProjectMessage();
  const [reply, setReply] = useState('');

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim() === '') return;
    sendMessage.mutate(
      { id: projectId, data: { body: reply.trim() } },
      {
        onSuccess: () => {
          setReply('');
          queryClient.invalidateQueries({ queryKey: getGetPortalProjectQueryKey(projectId) });
        },
      },
    );
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (isError || !project) {
    return <div className="p-8 text-center text-destructive">Project not found or you don't have access.</div>;
  }

  const totalMilestones = project.milestones?.length || 0;
  const completedMilestones = project.milestones?.filter(m => m.done).length || 0;
  const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/portal/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{project.title}</h1>
            <p className="text-muted-foreground font-mono-label">PROJECT ID: PRJ-{project.id.toString().padStart(4, '0')}</p>
          </div>
          <div className="px-3 py-1.5 rounded-full text-sm font-medium border uppercase tracking-wider bg-muted text-foreground">
            {project.status.replace('-', ' ')}
          </div>
        </div>

        <p className="text-foreground/90 leading-relaxed mb-8">{project.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/50 rounded-lg border border-border mb-8">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-mono-label text-muted-foreground text-xs">START DATE</p>
              <p className="font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-mono-label text-muted-foreground text-xs">TARGET COMPLETION</p>
              <p className="font-medium">{project.targetDate ? new Date(project.targetDate).toLocaleDateString() : 'TBD'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-display font-bold text-lg">Overall Progress</h2>
            <span className="font-display font-bold text-primary text-xl">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
        <h2 className="font-display font-bold text-xl mb-6 border-b border-border pb-4">Project Milestones</h2>
        
        {totalMilestones === 0 ? (
          <p className="text-muted-foreground italic">No milestones defined yet.</p>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {project.milestones.map((milestone, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-muted-foreground shadow-sm">
                  {milestone.done ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${milestone.done ? 'text-foreground' : 'text-foreground/70'}`}>{milestone.label}</h3>
                    {milestone.dueDate && (
                      <span className="text-xs text-muted-foreground font-mono-label bg-muted px-2 py-1 rounded">{new Date(milestone.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
        <h2 className="font-display font-bold text-xl mb-6 border-b border-border pb-4">Messages</h2>

        <div className="space-y-4">
          {(!project.messages || project.messages.length === 0) && (
            <p className="text-muted-foreground italic">
              No messages yet. Use the box below to ask us anything about this project.
            </p>
          )}

          {project.messages?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-xl border p-4 ${
                msg.isStaff ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
              }`}>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">{msg.author}</span>
                  {msg.isStaff && <span className="font-mono-label text-[10px] text-primary">CONSTRUCTATECH</span>}
                  <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{msg.body}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submitReply} className="mt-6 space-y-3 border-t border-border pt-6">
          <label htmlFor="project-reply" className="block text-sm font-semibold text-foreground">
            Send a message about this project
          </label>
          <textarea
            id="project-reply"
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your message…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {sendMessage.isError && (
            <p className="text-sm font-medium text-destructive">
              {sendMessage.error instanceof Error ? sendMessage.error.message : 'Could not send the message.'}
            </p>
          )}
          <button
            type="submit"
            disabled={sendMessage.isPending || reply.trim() === ''}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
