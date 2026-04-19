'use client';
// components/ui/Skeleton.tsx

interface Props {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function GameCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Skeleton className="h-36" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1 mt-2">
          <Skeleton className="h-5 w-10 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function WikiSectionSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-subtle">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-full mt-2" />
      </div>
      <div className="p-5 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
