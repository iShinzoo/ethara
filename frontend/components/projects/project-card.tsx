import { Project } from '@/types/projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddMemberModal } from './add-member-modal';
import { Users, ListTodo, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const completionRate = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  return (
    <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground line-clamp-2 font-semibold">{project.name}</CardTitle>
        {project.description && (
          <CardDescription className="text-muted-foreground line-clamp-2 text-xs mt-1">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Tasks
            </span>
            <span className="text-foreground font-semibold text-sm">
              {project.completedTaskCount}/{project.taskCount}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent to-secondary h-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{completionRate}% complete</p>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {project.members?.length ?? 0} member
              {(project.members?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <AddMemberModal projectId={project.id} />
        </div>
      </CardContent>
    </Card>
  );
}
