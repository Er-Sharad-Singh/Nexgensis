"use client";

import Link from "next/link";
import { FiPlus, FiSearch } from "react-icons/fi";

export default function ProductFilters({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch
            size={18}
            className="absolute left-3 top-3.5 text-[var(--color-text-muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={Boolean(search)}
          className="rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option
              key={typeof item === "string" ? item : item.slug}
              value={
                typeof item === "string"
                  ? item
                  : item.slug
              }
            >
              {typeof item === "string"
                ? item
                : item.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100"
        >
          <option value="">Sort By</option>
          <option value="price-asc">
            Price: Low to High
          </option>
          <option value="price-desc">
            Price: High to Low
          </option>
          <option value="rating-desc">
            Rating: High to Low
          </option>
          <option value="rating-asc">
            Rating: Low to High
          </option>
          <option value="title-asc">
            Title: A to Z
          </option>
          <option value="title-desc">
            Title: Z to A
          </option>
        </select>

        {/* Add Product */}
        <Link
          href="/products/new"
          className="flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <FiPlus size={17} />
          Add Product
        </Link>
      </div>

      {/* Search information */}
      {search && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-primary-light)] px-3 py-2">
          <FiSearch
            size={14}
            className="text-[var(--color-primary)]"
          />

          <p className="text-xs text-orange-700">
            Category filter is disabled while searching.
          </p>
        </div>
      )}
    </div>
  );
}