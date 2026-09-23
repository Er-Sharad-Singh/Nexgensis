# Product Admin Dashboard

A small responsive product administration dashboard built with **Next.js, React, Tailwind CSS, and Axios** using the free [DummyJSON](https://dummyjson.com) API.

The application allows users to authenticate, browse products, search and filter products, view product details, and perform add, edit, and delete operations.

> **Note:** DummyJSON simulates product mutations but does not permanently save added, edited, or deleted products. The application updates its local React state after successful mutation requests so that changes are immediately reflected in the UI.

---

## Features

### Authentication

* Login using DummyJSON authentication API.
* Test credentials are provided by the assignment.
* Displays an error for invalid credentials.
* Stores the returned access token in `localStorage`.
* Automatically attaches the token to API requests through Axios.
* Logout functionality.
* Unauthenticated users cannot access the product dashboard.

### Product Management

* Product listing with:

  * Product image
  * Product title
  * Category
  * Price
  * Rating
  * Stock
* Responsive desktop table.
* Responsive mobile product cards.
* Product details page.
* Product reviews.
* Add product.
* Edit product.
* Delete product with confirmation popup.
* Product not-found handling.

### Search

* Product search using:

```text
/products/search?q=
```

* Search requests are debounced.
* The API is not called on every keystroke.
* Search automatically returns to page 1.
* Previous requests are cancelled using `AbortController`.

This prevents an older, slower request from replacing the result of a newer search.

### Filtering and Sorting

Category filtering is implemented using:

```text
/products/category/{category}
```

Categories are loaded from:

```text
/products/categories
```

Sorting is supported by:

* Price: Low to High
* Price: High to Low
* Rating: Low to High
* Rating: High to Low
* Title: A to Z
* Title: Z to A

### Pagination

Pagination is implemented manually without any pagination library.

Supported page sizes:

* 10
* 20
* 50

The application uses the DummyJSON `limit` and `skip` parameters.

Example:

```text
/products?limit=20&page=2
```

The UI also displays information such as:

```text
Showing 21–40 of 194
```

### URL State

The following values are stored in the URL:

* Page
* Page size
* Search
* Category
* Sort

Example:

```text
/products?page=2&limit=20&search=phone&sort=price-asc
```

This means the same state is preserved when:

* Refreshing the page
* Copying the URL
* Sharing the URL
* Navigating back and forward

Invalid URL values are handled safely.

For example:

```text
/products?page=abc
```

falls back to page 1 instead of breaking the application.

---

# Tech Stack

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| Next.js      | Application framework and routing  |
| React        | UI components and state management |
| Tailwind CSS | Styling and responsive design      |
| Axios        | HTTP requests                      |
| React Icons  | UI icons                           |
| DummyJSON    | Authentication and product API     |
| JavaScript   | Application logic                  |

### Libraries intentionally not used

The assignment specifically requires implementing the logic manually.

Therefore, the project does **not** use:

* React Query
* SWR
* Ready-made table libraries
* Ready-made pagination libraries

---

# Project Structure

```text
product-admin/
│
├── app/
│   │
│   ├── globals.css
│   │
│   ├── layout.jsx
│   │
│   ├── page.jsx
│   │
│   ├── login/
│   │   └── page.jsx
│   │
│   └── products/
│       │
│       ├── page.jsx
│       │
│       ├── new/
│       │   └── page.jsx
│       │
│       └── [id]/
│           │
│           ├── page.jsx
│           │
│           └── edit/
│               └── page.jsx
│
├── components/
│   │
│   ├── ErrorMessage.jsx
│   ├── Loader.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductFilters.jsx
│   ├── ProductForm.jsx
│   └── ProductTable.jsx
│
├── hooks/
│   └── useDebounce.js
│
├── lib/
│   │
│   ├── axios.js
│   ├── auth.js
│   └── products.js
│
├── public/
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── ...
```

---

# Folder Explanation

## `app/`

The `app` directory contains Next.js routes and pages.

### `app/page.jsx`

The root route redirects users to the login page.

```text
/
↓
/login
```

This keeps the login page as the entry point of the application.

---

## `app/login/page.jsx`

Handles user authentication.

The page:

1. Accepts username and password.
2. Prevents multiple login requests while a login request is already running.
3. Calls the authentication API.
4. Stores the returned access token.
5. Redirects to `/products` after successful login.
6. Displays an error when authentication fails.

---

## `app/products/page.jsx`

This is the main product dashboard.

It handles:

* Product loading
* Search
* Category filtering
* Sorting
* Pagination
* URL synchronization
* Product deletion
* Loading state
* Empty state
* Error state
* Retry functionality
* Logout

The page delegates UI rendering to smaller components.

---

## `app/products/new/page.jsx`

Provides the Add Product page.

It uses the shared `ProductForm` component rather than creating another separate form.

---

## `app/products/[id]/page.jsx`

Displays the details of a specific product.

The page includes:

* Product images
* Product title
* Description
* Price
* Category
* Rating
* Stock
* Reviews

If the product ID does not exist, an appropriate not-found state is displayed.

---

## `app/products/[id]/edit/page.jsx`

Loads an existing product and passes its data to the reusable `ProductForm`.

After submitting the form:

```text
PUT /products/{id}
```

is called.

After a successful response, the user is redirected to the product details page.

---

# Components

## `ProductTable.jsx`

Displays products in a desktop table.

Columns include:

* Product
* Category
* Price
* Rating
* Stock
* Actions

Actions:

* View
* Edit
* Delete

---

## `ProductCard.jsx`

Provides the mobile layout for products.

Instead of a table, each product is displayed as a responsive card.

This is shown on smaller screens while the desktop table is hidden.

---

## `ProductFilters.jsx`

Contains:

* Search input
* Category dropdown
* Sort dropdown
* Add Product button

When search is active, the category filter is disabled.

---

## `Pagination.jsx`

Contains manually implemented pagination logic.

It provides:

* Previous button
* Next button
* Page numbers
* Page size selection
* Current result range

Example:

```text
Showing 21–40 of 194
```

---

## `ProductForm.jsx`

Reusable form used for both:

* Add Product
* Edit Product

Fields:

* Title
* Description
* Price
* Category
* Stock

Client-side validation is performed before the API request.

The form also prevents duplicate submissions by disabling the save button while a request is running.

---

## `Loader.jsx`

Displays a loading spinner while API data is being fetched.

---

## `ErrorMessage.jsx`

Displays a common error UI with a Retry button.

---

# Hooks

## `useDebounce.js`

The search input uses a debounce hook.

Instead of making an API request for every character:

```text
p
ph
pho
phon
phone
```

the application waits until the user stops typing for a short period before calling the API.

This reduces unnecessary requests.

---

# API Layer

All API calls are separated from UI components.

The UI does not directly contain Axios requests.

API-related logic is located inside:

```text
lib/
├── axios.js
├── auth.js
└── products.js
```

This keeps components focused on rendering and user interaction.

---

# Axios Configuration

## `lib/axios.js`

A single shared Axios instance is used throughout the application.

The base URL is:

```text
https://dummyjson.com
```

The Axios instance also contains an interceptor that reads the authentication token from `localStorage` and attaches it to outgoing requests.

Conceptually:

```text
Request
   ↓
Axios interceptor
   ↓
Read access token
   ↓
Attach Authorization header
   ↓
DummyJSON API
```

This avoids manually adding the token in every API function.

---

# Authentication Flow

```text
Login Page
    │
    │ username + password
    ▼
loginUser()
    │
    ▼
POST /auth/login
    │
    ▼
DummyJSON
    │
    ├── Invalid → Error message
    │
    └── Valid
          │
          ▼
      accessToken
          │
          ▼
      localStorage
          │
          ▼
      /products
```

The login credentials are validated by DummyJSON rather than by the frontend.

---

# Product API Flow

## Product List

```text
GET /products
```

with:

```text
limit
skip
sortBy
order
```

---

## Search

```text
GET /products/search?q={query}
```

Search requests are debounced.

An `AbortController` is used to cancel the previous request when a newer request starts.

This handles the following situation:

```text
Request A → phone
Request B → iphone
```

If Request A takes longer than Request B, its result should not overwrite the newer result.

The previous request is therefore cancelled.

---

# Search + Category Limitation

DummyJSON does not provide a single endpoint that combines its product search and category filtering in the way required by the application.

For example, the application cannot simply depend on:

```text
/products/search?q=phone&category=beauty
```

as a server-side combined search and category operation.

Instead, the application chooses a simple and predictable behavior:

> When search is active, the category filter is disabled.

This avoids implementing inconsistent client-side filtering and pagination against partial API results.

The UI communicates this to the user with:

```text
Category filter is disabled while searching.
```

---

# Add, Edit and Delete

DummyJSON supports mutation endpoints, but these operations are simulated and are not permanently persisted in the remote dataset.

For example:

```text
POST /products/add
PUT /products/{id}
DELETE /products/{id}
```

may return successful responses, but the changes are not permanently stored on the DummyJSON server.

Therefore, the application follows this approach:

```text
User action
    ↓
DummyJSON mutation request
    ↓
Successful response
    ↓
Update application state
    ↓
Show change immediately in UI
```

This provides a realistic admin-dashboard experience while accurately reflecting the limitation of the test API.

---

# Form Validation

The Add/Edit form validates:

### Title

Required.

### Description

Required.

### Price

Must be greater than zero.

### Category

Required.

### Stock

Must be zero or greater.

Validation happens before sending the API request.

---

# Preventing Duplicate Requests

The application prevents rapid repeated actions.

For login:

```text
if (loading) return;
```

For product saving:

```text
if (saving) return;
```

This means repeatedly clicking the button while the request is already running does not create multiple API requests.

---

# Loading, Empty and Error States

The application handles three different states.

## Loading

A spinner is displayed while API data is being fetched.

## Empty

If the API returns no products:

```text
No products found

Try changing your search or filters.
```

is displayed.

## Error

If an API request fails:

```text
Something went wrong

We could not load the products.

Retry
```

is displayed.

The Retry button starts the request again.

---

# Responsive Design

The dashboard is designed for both desktop and mobile.

### Desktop

Products are displayed using a table.

### Mobile

Products are displayed as cards.

Tailwind responsive utilities are used to switch between layouts.

Example:

```text
Desktop → ProductTable
Mobile  → ProductCard
```

---

# Theme

The application's colors and common design values are centralized in:

```text
app/theme.css
```

The theme contains variables for:

* Primary color
* Primary hover color
* Background
* Surface
* Text
* Muted text
* Border
* Success
* Danger
* Warning
* Border radius
* Card shadow

This makes future visual changes easier.

For example, changing:

```css
--color-primary: #f98716;
```

updates the main application color without manually changing every component.

---

# Setup

## Requirements

Make sure Node.js and npm are installed.

Check:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd product-admin
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application redirects to:

```text
http://localhost:3000/login
```

---

# Login

Use the credentials specified by the assignment:

```text
Username: emilys
Password: emilyspass
```

Authentication is performed through DummyJSON.

---

# Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# Environment Variables

The current project uses the public DummyJSON API and does not require a private API key.

The API base URL is configured in the shared Axios setup.

If desired, it can later be moved to an environment variable such as:

```text
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

---

# Deployment

The application can be deployed using Vercel.

General deployment process:

```text
GitHub Repository
       ↓
Connect to Vercel
       ↓
Select Next.js project
       ↓
Deploy
       ↓
Live URL
```

---

# Problem Faced and Solution

## Problem: Race condition during product search

When users type quickly, multiple search requests can be created.

For example:

```text
phone
phones
iphone
```

The network does not guarantee that the requests will finish in the same order they were created.

Therefore, an older request could potentially finish after the newest request and incorrectly replace the current results.

### Solution

The application combines:

1. Debouncing
2. `AbortController`
3. Request cancellation during cleanup

The debounce reduces unnecessary API requests, while `AbortController` prevents an older request from updating the UI after a newer search has started.

---

# AI Usage

AI tools were used during development as a coding assistant for:

* Structuring components
* Reviewing implementation approaches
* Improving UI consistency
* Explaining API handling
* Identifying edge cases
* Reviewing race-condition handling
* Creating and refining reusable components

The generated code was reviewed and adapted manually.

The developer understands the implemented logic and can explain the application architecture and individual components.

---

# Assignment Requirements Checklist

| Requirement                      | Status |
| -------------------------------- | ------ |
| Next.js                          | ✅      |
| React                            | ✅      |
| Tailwind CSS                     | ✅      |
| Axios                            | ✅      |
| Login                            | ✅      |
| Login error handling             | ✅      |
| Logout                           | ✅      |
| Protected product page           | ✅      |
| Product table                    | ✅      |
| Mobile cards                     | ✅      |
| Pagination                       | ✅      |
| Page size 10/20/50               | ✅      |
| Search                           | ✅      |
| Debounced search                 | ✅      |
| Category filter                  | ✅      |
| Sorting                          | ✅      |
| URL state                        | ✅      |
| Product details                  | ✅      |
| Reviews                          | ✅      |
| Not-found handling               | ✅      |
| Add product                      | ✅      |
| Edit product                     | ✅      |
| Delete product                   | ✅      |
| Delete confirmation              | ✅      |
| Loading state                    | ✅      |
| Empty state                      | ✅      |
| Error state                      | ✅      |
| Retry                            | ✅      |
| Duplicate request protection     | ✅      |
| Shared Axios setup               | ✅      |
| API calls separated from UI      | ✅      |
| No React Query                   | ✅      |
| No SWR                           | ✅      |
| No ready-made table library      | ✅      |
| No ready-made pagination library | ✅      |

---

# Author

**Sharad Singh**

Built as a frontend assignment demonstrating React/Next.js application structure, API integration, authentication, responsive UI, state management, and manual pagination/filtering logic.
