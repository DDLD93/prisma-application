import { LoadingFallback } from "@/components/loading-fallback";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <LoadingFallback variant="inline" className="py-8" />
    </div>
  );
}
