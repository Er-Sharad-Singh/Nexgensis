"use client";

import { useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ProductForm({
  initialData = {},
  onSubmit,
  submitText = "Save Product",
}) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price ?? "",
    category: initialData.category || "",
    stock: initialData.stock ?? "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (form.price === "" || Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      newErrors.stock = "Stock cannot be negative.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
      });
    } catch {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Product Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        />

        {errors.title && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={4}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        />

        {errors.description && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Price
          </label>

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />

          {errors.price && (
            <p className="mt-1 text-xs text-[var(--color-danger)]">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />

          {errors.category && (
            <p className="mt-1 text-xs text-[var(--color-danger)]">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Stock
          </label>

          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />

          {errors.stock && (
            <p className="mt-1 text-xs text-[var(--color-danger)]">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-gray-50"
        >
          <FiArrowLeft size={16} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiSave size={16} />

          {saving ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
