import { NotFoundFallback } from "@/components/not-found-fallback";

export default function RootNotFound() {
  return (
    <NotFoundFallback
      homeHref="/"
      homeLabel="Back to home"
      message="The page you're looking for doesn't exist or was moved."
    />
  );
}
