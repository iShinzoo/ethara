import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProjectsSkeleton() {
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

      {/* Project cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-slate-700 bg-slate-800">
            <CardHeader>
              <div className="h-6 bg-slate-700 rounded w-32 animate-pulse mb-2" />
              <div className="h-4 bg-slate-700 rounded w-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-24 animate-pulse" />
                <div className="h-10 bg-slate-700 rounded w-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
