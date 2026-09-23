import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function ErrorMessage({ onRetry }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-light)]">
        <FiAlertCircle
          size={22}
          className="text-[var(--color-danger)]"
        />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
        Something went wrong
      </h2>

      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        We could not load the products. Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <FiRefreshCw size={15} />
        Retry
      </button>
    </div>
  );
}
