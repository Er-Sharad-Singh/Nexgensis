export default function Loader() {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]"
        aria-label="Loading"
      />

      <p className="text-sm text-[var(--color-text-muted)]">
        Loading products...
      </p>
    </div>
  );
}
