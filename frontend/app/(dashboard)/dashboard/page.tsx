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
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here&apos;s your task overview.</p>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards stats={stats} />

      {/* Charts and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Progress */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Project Progress</CardTitle>
            <CardDescription>Tasks completed per project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.project_progress.length === 0 ? (
                <p className="text-slate-400 text-sm">No projects yet</p>
              ) : (
                dashboardData.project_progress.map((project) => (
                  <div key={project.project_id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{project.project_name}</span>
                      <span className="text-sm text-slate-400">{Math.round(project.progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
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
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Summary</CardTitle>
            <CardDescription>Overview of your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-slate-400">Tasks Completed</span>
                <span className="text-lg font-semibold text-green-400">{dashboardData.completed_tasks} / {dashboardData.total_tasks}</span>
              </div>
              <div className="border-t border-slate-700"></div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-slate-400">Overdue Tasks</span>
                <span className="text-lg font-semibold text-red-400">{dashboardData.overdue_tasks}</span>
              </div>
              <div className="border-t border-slate-700"></div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-slate-400">Assigned to You</span>
                <span className="text-lg font-semibold text-blue-400">{dashboardData.assigned_to_me}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
