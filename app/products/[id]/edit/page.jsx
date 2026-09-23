"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import ProductForm from "../../../../components/ProductForm";
import Loader from "../../../../components/Loader";
import ErrorMessage from "../../../../components/ErrorMessage";

import {
  getProduct,
  updateProduct,
} from "../../../../lib/products";

export default function EditProductPage() {
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
        setError("Product not found.");
      } else {
        setError("Failed to load product.");
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

  const handleUpdate = async (data) => {
    await updateProduct(productId, data);

    router.push(`/products/${productId}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
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

          <div className="mt-4 text-center">
            <Link
              href="/products"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/products/${productId}`}
            className="text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            <FiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              Edit Product
            </h1>

            <p className="text-sm text-[var(--color-text-muted)]">
              Update product information
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <ProductForm
            initialData={product}
            onSubmit={handleUpdate}
            submitText="Update Product"
          />
        </div>
      </section>
    </main>
  );
}

