import { NotFoundFallback } from "@/components/not-found-fallback";

export default function AuthNotFound() {
  return (
    <NotFoundFallback
      homeHref="/login"
      homeLabel="Back to sign in"
      message="This page doesn't exist. Try signing in or registering."
    />
  );
}
