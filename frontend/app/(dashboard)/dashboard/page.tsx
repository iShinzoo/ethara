'use client';

import { useDashboardStats } from '@/hooks/queries/useDashboard';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { ErrorFallback } from '@/components/common/error-fallback';
import { AnalyticsCards } from '@/components/dashboard/analytics-cards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, ListTodo, User } from 'lucide-react';

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorFallback onRetry={() => refetch()} />;
  }

  if (!dashboardData) {
    return <ErrorFallback />;
  }

  const projectProgress = dashboardData.project_progress ?? [];

  const stats = [
    {
      title: 'Total Tasks',
      value: dashboardData.total_tasks,
      icon: ListTodo,
      color: 'text-blue-400',
    },
    {
      title: 'Completed',
      value: dashboardData.completed_tasks,
      icon: CheckCircle2,
      color: 'text-green-400',
    },
    {
      title: 'Overdue',
      value: dashboardData.overdue_tasks,
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      title: 'Assigned to Me',
      value: dashboardData.assigned_to_me,
      icon: User,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your task overview.
        </p>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards stats={stats} />

      {/* Charts and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Progress */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Project Progress</CardTitle>
            <CardDescription>Tasks completed per project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgress.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects yet</p>
              ) : (
                projectProgress.map((project) => (
                  <div key={project.project_id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{project.project_name}</span>
                      <span className="text-sm text-muted-foreground">{Math.round(project.progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Summary</CardTitle>
            <CardDescription>Overview of your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <span className="text-lg font-semibold text-foreground">
                  {dashboardData.completed_tasks} / {dashboardData.total_tasks}
                </span>
              </div>
              <div className="border-t border-border"></div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-muted-foreground">Overdue Tasks</span>
                <span className="text-lg font-semibold text-foreground">{dashboardData.overdue_tasks}</span>
              </div>
              <div className="border-t border-border"></div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-muted-foreground">Assigned to You</span>
                <span className="text-lg font-semibold text-foreground">{dashboardData.assigned_to_me}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
