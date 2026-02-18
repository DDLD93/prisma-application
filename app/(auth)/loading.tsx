import { LoadingFallback } from "@/components/loading-fallback";

export default function AuthLoading() {
  return (
    <LoadingFallback
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4"
      variant="full"
    />
  );
}
