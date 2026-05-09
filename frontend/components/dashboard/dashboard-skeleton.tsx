import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-700 bg-slate-800">
            <CardHeader className="pb-2">
              <div className="h-4 bg-slate-700 rounded w-24 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-700 rounded w-16 animate-pulse mb-2" />
              <div className="h-3 bg-slate-700 rounded w-20 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <div className="h-6 bg-slate-700 rounded w-32 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-700 rounded animate-pulse" />
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <div className="h-6 bg-slate-700 rounded w-32 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
