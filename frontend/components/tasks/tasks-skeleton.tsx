import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function TasksSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-slate-700 rounded w-32 animate-pulse mb-2" />
          <div className="h-4 bg-slate-700 rounded w-48 animate-pulse" />
        </div>
        <div className="h-10 bg-slate-700 rounded w-32 animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3 flex-wrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-700 rounded w-32 animate-pulse" />
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <div className="h-6 bg-slate-700 rounded w-32 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
