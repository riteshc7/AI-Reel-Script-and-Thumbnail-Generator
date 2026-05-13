export function ScriptSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-5 w-12" />
      </div>
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex gap-2">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-14" />
      </div>
      <div className="flex justify-between pt-3 border-t border-border">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  );
}

export function ThumbnailSkeleton() {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="skeleton aspect-video rounded-xl" />
      <div className="skeleton h-4 w-full" />
      <div className="flex justify-between">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-10" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton h-10 w-10 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-16 mb-1" />
      <div className="skeleton h-4 w-24" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-9 w-48 mb-2" />
          <div className="skeleton h-5 w-36" />
        </div>
        <div className="skeleton h-11 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatSkeleton /><StatSkeleton /><StatSkeleton />
      </div>
      <div>
        <div className="skeleton h-7 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScriptSkeleton /><ScriptSkeleton /><ScriptSkeleton />
        </div>
      </div>
    </div>
  );
}
