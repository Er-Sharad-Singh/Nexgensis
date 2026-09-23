"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiStar,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

import { getProduct } from "../../../lib/products";
import Loader from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productId = params.id;

  const loadProduct = async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await getProduct(
        productId,
        signal
      );

      setProduct(response.data);
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return;
      }

      if (error.response?.status === 404) {
        setError("not-found");
      } else {
        setError("error");
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    loadProduct(controller.signal);

    return () => {
      controller.abort();
    };
  }, [productId]);

  if (loading) {
    return <Loader />;
  }

  /* Wrong product ID */
  if (error === "not-found") {
    return (
      <main className="min-h-screen bg-[var(--color-background)] p-4 sm:p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger-light)]">
              <FiAlertCircle
                size={26}
                className="text-[var(--color-danger)]"
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[var(--color-text)]">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              The product you're looking for does not
              exist.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              <FiArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* API error */
  if (error === "error") {
    return (
      <main className="min-h-screen bg-[var(--color-background)] p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <ErrorMessage
            onRetry={() =>
              loadProduct(
                new AbortController().signal
              )
            }
          />
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </Link>

          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            Edit Product
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Images */}
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
            <div className="overflow-hidden rounded-xl bg-gray-50">
              <img
                src={
                  product.images?.[0] ||
                  product.thumbnail
                }
                alt={product.title}
                className="h-80 w-full object-contain sm:h-[420px]"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images
                  .slice(0, 4)
                  .map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-gray-50"
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
            <span className="inline-flex rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium capitalize text-[var(--color-primary)]">
              {product.category}
            </span>

            <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-[var(--color-text)]">
                ${product.price.toFixed(2)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-light)] px-3 py-1 text-sm font-medium text-[var(--color-warning)]">
                <FiStar size={14} />
                {product.rating}
              </span>

              <span
                className={
                  product.stock > 0
                    ? "rounded-full bg-[var(--color-success-light)] px-3 py-1 text-xs font-medium text-[var(--color-success)]"
                    : "rounded-full bg-[var(--color-danger-light)] px-3 py-1 text-xs font-medium text-[var(--color-danger)]"
                }
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="my-6 border-t border-[var(--color-border)]" />

            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text)]">
              Description
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {product.description}
            </p>

            {/* Product information */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Brand
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-[var(--color-text)]">
                  {product.brand || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-[var(--color-text-muted)]">
                  SKU
                </p>

                <p className="mt-1 truncate text-sm font-medium text-[var(--color-text)]">
                  {product.sku || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Discount
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-success)]">
                  {product.discountPercentage
                    ? `${product.discountPercentage}%`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Product ID
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  #{product.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Reviews
              </h2>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Customer feedback for this product
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-warning)]">
              <FiStar size={16} />
              {product.rating}
            </div>
          </div>

          {product.reviews?.length > 0 ? (
            <div className="mt-5 divide-y divide-[var(--color-border)]">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {review.reviewerName}
                      </p>

                      <p className="text-xs text-[var(--color-text-muted)]">
                        {review.reviewerEmail}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-light)] px-2.5 py-1 text-xs font-medium text-[var(--color-warning)]">
                      ⭐ {review.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {review.comment}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(
                      review.date
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-gray-50 p-6 text-center">
              <FiPackage
                size={22}
                className="mx-auto text-[var(--color-text-muted)]"
              />

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                No reviews available.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

