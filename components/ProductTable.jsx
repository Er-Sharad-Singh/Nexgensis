import Link from "next/link";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] md:block">
      <table className="w-full">
        <thead className="border-b border-[var(--color-border)] bg-gray-50">
          <tr className="text-left text-sm text-[var(--color-text-muted)]">
            <th className="px-5 py-4 font-medium">Product</th>
            <th className="px-5 py-4 font-medium">Category</th>
            <th className="px-5 py-4 font-medium">Price</th>
            <th className="px-5 py-4 font-medium">Rating</th>
            <th className="px-5 py-4 font-medium">Stock</th>
            <th className="px-5 py-4 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-[var(--color-border)] last:border-b-0 transition hover:bg-gray-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg border border-[var(--color-border)] object-cover"
                  />

                  <div className="min-w-0">
                    <p className="max-w-xs truncate font-medium text-[var(--color-text)]">
                      {product.title}
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      ID: #{product.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                  {product.category}
                </span>
              </td>

              <td className="px-5 py-4 font-semibold text-[var(--color-text)]">
                ${product.price.toFixed(2)}
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-light)] px-2.5 py-1 text-sm font-medium text-[var(--color-warning)]">
                  ⭐ {product.rating}
                </span>
              </td>

              <td className="px-5 py-4">
                <span
                  className={
                    product.stock > 0
                      ? "inline-flex rounded-full bg-[var(--color-success-light)] px-2.5 py-1 text-xs font-medium text-[var(--color-success)]"
                      : "inline-flex rounded-full bg-[var(--color-danger-light)] px-2.5 py-1 text-xs font-medium text-[var(--color-danger)]"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    title="View product"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEye size={17} />
                  </Link>

                  <Link
                    href={`/products/${product.id}/edit`}
                    title="Edit product"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <FiEdit size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    title="Delete product"
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

