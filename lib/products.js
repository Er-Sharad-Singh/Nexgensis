
import api from "./axios";

/*
  Get products with pagination and sorting.
*/
export function getProducts(params, signal) {
  return api.get("/products", {
    params,
    signal,
  });
}

/*
  Search products.
*/
export function searchProducts(params, signal) {
  return api.get("/products/search", {
    params,
    signal,
  });
}

/*
  Get products by category.
*/
export function getCategoryProducts(
  category,
  params,
  signal
) {
  return api.get(
    `/products/category/${category}`,
    {
      params,
      signal,
    }
  );
}

/*
  Get all product categories.
*/
export function getCategories() {
  return api.get("/products/categories");
}

/*
  Get a single product.
*/
export function getProduct(id, signal) {
  return api.get(`/products/${id}`, {
    signal,
  });
}

/*
  Add a product.
*/
export function createProduct(data) {
  return api.post("/products/add", data);
}

/*
  Update a product.
*/
export function updateProduct(id, data) {
  return api.put(`/products/${id}`, data);
}

/*
  Delete a product.
*/
export function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

