"use client";

import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Pagination({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Results info */}
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing{" "}
          <span className="font-medium text-[var(--color-text)]">
            {start}–{end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[var(--color-text)]">
            {total}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Page size */}
          <select
            value={limit}
            onChange={(e) =>
              onLimitChange(Number(e.target.value))
            }
            className="rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          {/* Previous */}
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={16} />
            <span className="hidden sm:inline">
              Previous
            </span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPages().map((number, index) =>
              number === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-[var(--color-text-muted)]"
                >
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  type="button"
                  onClick={() => onPageChange(number)}
                  className={`h-9 min-w-9 rounded-[var(--radius-button)] px-2 text-sm font-medium transition ${
                    page === number
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            type="button"
            disabled={
              page === totalPages || totalPages === 0
            }
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">
              Next
            </span>
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
