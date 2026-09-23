import Link from "next/link";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]"
        >
          {/* Product information */}
          <div className="p-4">
            <div className="flex gap-4">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-20 w-20 shrink-0 rounded-xl border border-[var(--color-border)] object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-[var(--color-text)]">
                  {product.title}
                </h3>

                <span className="mt-1.5 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-[var(--color-text-muted)]">
                  {product.category}
                </span>

                <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Product stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-2.5">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Rating
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  ⭐ {product.rating}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-2.5">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Stock
                </p>

                <p
                  className={
                    product.stock > 0
                      ? "mt-1 text-sm font-medium text-[var(--color-success)]"
                      : "mt-1 text-sm font-medium text-[var(--color-danger)]"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-gray-50 px-4 py-3">
            <span className="text-xs text-[var(--color-text-muted)]">
              Product #{product.id}
            </span>

            <div className="flex items-center gap-1">
              <Link
                href={`/products/${product.id}`}
                title="View product"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
              >
                <FiEye size={17} />
              </Link>

              <Link
                href={`/products/${product.id}/edit`}
                title="Edit product"
                className="rounded-lg p-2 text-[var(--color-primary)] transition hover:bg-[var(--color-primary-light)]"
              >
                <FiEdit size={17} />
              </Link>

              <button
                type="button"
                onClick={() => onDelete(product.id)}
                title="Delete product"
                className="rounded-lg p-2 text-[var(--color-danger)] transition hover:bg-[var(--color-danger-light)]"
              >
                <FiTrash2 size={17} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
