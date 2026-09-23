"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../../lib/products";

export default function NewProductPage() {
  const router = useRouter();

  const handleCreate = async (data) => {
    await createProduct(data);

    /*
      DummyJSON does not permanently save the product.
      The API returns a successful response, so we redirect
      back to the product list.
    */
    router.push("/products");
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/products"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          >
            <FiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl font-bold">
              Add Product
            </h1>

            <p className="text-sm text-[var(--color-text-muted)]">
              Create a new product
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <ProductForm
            onSubmit={handleCreate}
            submitText="Add Product"
          />
        </div>
      </section>
    </main>
  );
}
