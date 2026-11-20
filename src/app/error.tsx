"use client";

import { Container } from "@/components/container";

// Shows a generic message only; error details stay in server logs.
export default function Error({ reset }: { reset: () => void }) {
  return (
    <Container className="py-24 sm:py-32">
      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-fg-muted mt-4 max-w-[60ch]">
        This page could not be displayed. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-accent text-accent-fg mt-8 inline-flex min-h-11 items-center rounded-md px-5 text-sm font-medium hover:opacity-90"
      >
        Try again
      </button>
    </Container>
  );
}
