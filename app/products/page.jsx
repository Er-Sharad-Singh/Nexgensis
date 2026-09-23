"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiLogOut, FiPackage } from "react-icons/fi";

import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

import useDebounce from "../../hooks/useDebounce";

import {
  getCategories,
  getCategoryProducts,
  getProducts,
  searchProducts,
   deleteProduct,
} from "../../lib/products";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ---------------- URL values ---------------- */

  const urlPage = Number(searchParams.get("page"));
  const urlLimit = Number(searchParams.get("limit"));

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = searchParams.get("sort") || "";

  const page =
    Number.isInteger(urlPage) && urlPage > 0
      ? urlPage
      : 1;

  const limit = [10, 20, 50].includes(urlLimit)
    ? urlLimit
    : 10;

  /* ---------------- State ---------------- */

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState(urlSort);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const totalPages = Math.ceil(total / limit);

  /* ---------------- Sort parameters ---------------- */

  const sortParams = useMemo(() => {
    if (!sort) {
      return {};
    }

    const [sortBy, order] = sort.split("-");

    return {
      sortBy,
      order,
    };
  }, [sort]);

  /* ---------------- URL helper ---------------- */

  const updateUrl = useCallback(
    (values) => {
      const params = new URLSearchParams();

      const nextPage = values.page ?? page;
      const nextLimit = values.limit ?? limit;
      const nextSearch = values.search ?? search;
      const nextCategory = values.category ?? category;
      const nextSort = values.sort ?? sort;

      if (nextPage > 1) {
        params.set("page", nextPage);
      }

      if (nextLimit !== 10) {
        params.set("limit", nextLimit);
      }

      if (nextSearch) {
        params.set("search", nextSearch);
      }

      /*
        DummyJSON cannot search and category-filter
        in the same request.

        While searching, category is ignored.
      */
      if (nextCategory && !nextSearch) {
        params.set("category", nextCategory);
      }

      if (nextSort) {
        params.set("sort", nextSort);
      }

      const query = params.toString();

      router.push(
        query ? `${pathname}?${query}` : pathname
      );
    },
    [
      page,
      limit,
      search,
      category,
      sort,
      pathname,
      router,
    ]
  );

  /* ---------------- Load products ---------------- */

  const loadProducts = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const params = {
          limit,
          skip: (page - 1) * limit,
          ...sortParams,
        };

        let response;

        if (debouncedSearch) {
          response = await searchProducts(
            {
              q: debouncedSearch,
              limit,
              skip: (page - 1) * limit,
              ...sortParams,
            },
            signal
          );
        } else if (category) {
          response = await getCategoryProducts(
            category,
            params,
            signal
          );
        } else {
          response = await getProducts(
            params,
            signal
          );
        }

        const data = response.data;

        const nextProducts = data.products || [];
        const nextTotal = data.total || 0;

        /*
          If someone opens ?page=999,
          move them to the last valid page.
        */
        const nextTotalPages = Math.ceil(
          nextTotal / limit
        );

        if (
          page > 1 &&
          (nextTotalPages === 0 ||
            page > nextTotalPages)
        ) {
          const validPage =
            nextTotalPages > 0
              ? nextTotalPages
              : 1;

          updateUrl({
            page: validPage,
          });

          return;
        }

        setProducts(nextProducts);
        setTotal(nextTotal);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setError(
          "We could not load the products."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [
      page,
      limit,
      category,
      debouncedSearch,
      sortParams,
      updateUrl,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  /* ---------------- Load categories ---------------- */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        setCategories(response.data);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  /* ---------------- Keep state synced with URL ---------------- */

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSort(urlSort);
  }, [urlSort]);

  /* ---------------- Handlers ---------------- */

  const handleSearch = (value) => {
    setSearch(value);

    updateUrl({
      page: 1,
      search: value,
    });
  };

  const handleCategory = (value) => {
    setCategory(value);

    updateUrl({
      page: 1,
      category: value,
    });
  };

  const handleSort = (value) => {
    setSort(value);

    updateUrl({
      page: 1,
      sort: value,
    });
  };

  const handlePage = (value) => {
    updateUrl({
      page: value,
    });
  };

  const handleLimit = (value) => {
    updateUrl({
      page: 1,
      limit: value,
    });
  };

  /* ---------------- Delete ---------------- */


const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    await deleteProduct(id);

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );

    setTotal((currentTotal) =>
      Math.max(currentTotal - 1, 0)
    );
  } catch {
    setError("Failed to delete product.");
  }
};


  /* ---------------- Logout ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  /* ---------------- Retry ---------------- */

  const handleRetry = () => {
    const controller = new AbortController();

    loadProducts(controller.signal);
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
              <FiPackage
                size={20}
                className="text-[var(--color-primary)]"
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)]">
                Product Admin
              </h1>

              <p className="hidden text-xs text-[var(--color-text-muted)] sm:block">
                Manage your product inventory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-red-200 hover:bg-[var(--color-danger-light)] hover:text-[var(--color-danger)]"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Products
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Search, filter and manage your products.
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearchChange={handleSearch}
          onCategoryChange={handleCategory}
          onSortChange={handleSort}
        />

        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {!loading && error && (
          <ErrorMessage onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FiPackage
                  size={22}
                  className="text-[var(--color-text-muted)]"
                />
              </div>

              <h2 className="mt-4 font-semibold text-[var(--color-text)]">
                No products found
              </h2>

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Try changing your search or filters.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <ProductTable
                products={products}
                onDelete={handleDelete}
              />

              <ProductCard
                products={products}
                onDelete={handleDelete}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                total={total}
                onPageChange={handlePage}
                onLimitChange={handleLimit}
              />
            </>
          )}
      </section>
    </main>
  );
}