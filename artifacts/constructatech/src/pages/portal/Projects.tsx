import React from 'react';
import { useListPortalProjects } from '@workspace/api-client-react';
import { Loader2, ArrowRight, Clock, CheckCircle2, PlayCircle, FileSearch } from 'lucide-react';
import { Link } from 'wouter';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'scoping': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><FileSearch className="w-3 h-3"/> Scoping</span>;
    case 'in-progress': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"><PlayCircle className="w-3 h-3"/> In Progress</span>;
    case 'on-hold': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3 h-3"/> On Hold</span>;
    case 'completed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
    default: return null;
  }
};

export default function Projects() {
  const { data: projects, isLoading } = useListPortalProjects();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground">Track the deployment of your infrastructure.</p>
      </div>

      {!projects?.length ? (
        <div className="bg-card border border-border p-12 rounded-xl text-center shadow-sm">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-display font-bold mb-2">No Active Projects</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your project timeline will appear here once our engineering team begins work on your requested infrastructure.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const totalMilestones = project.milestones?.length || 0;
            const completedMilestones = project.milestones?.filter(m => m.done).length || 0;
            const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

            return (
              <Link key={project.id} href={`/portal/projects/${project.id}`} className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <StatusBadge status={project.status} />
                  <span className="text-xs text-muted-foreground font-mono-label">ID: PRJ-{project.id.toString().padStart(4, '0')}</span>
                </div>
                
                <h2 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">{project.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{completedMilestones} of {totalMilestones} milestones</div>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    View Details <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Ensure FolderKanban is imported for the empty state
import { FolderKanban } from 'lucide-react';
