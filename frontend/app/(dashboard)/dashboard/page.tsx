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
      value: dashboardData.totalTasks,
      icon: ListTodo,
      color: 'text-blue-400',
    },
    {
      title: 'Completed',
      value: dashboardData.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-400',
    },
    {
      title: 'Overdue',
      value: dashboardData.overdueTasks,
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      title: 'Assigned to Me',
      value: dashboardData.assignedToMe,
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
              {dashboardData.projects.length === 0 ? (
                <p className="text-slate-400 text-sm">No projects yet</p>
              ) : (
                dashboardData.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{project.name}</span>
                      <span className="text-sm text-slate-400">{project.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Tasks</CardTitle>
            <CardDescription>Your latest tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentTasks.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent tasks</p>
              ) : (
                dashboardData.recentTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-slate-700 transition">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{task.title}</p>
                      <p className="text-xs text-slate-400">{task.projectName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
