import { NotFoundFallback } from "@/components/not-found-fallback";

export default function ParentNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center">
      <NotFoundFallback
        homeHref="/"
        homeLabel="Back to dashboard"
        message="This page doesn't exist. Return to your dashboard."
      />
    </div>
  );
}
