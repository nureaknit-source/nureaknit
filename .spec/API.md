# API.md: Nureaknite

## Authentication & Authorization

Authentication is managed using NextAuth.js, which leverages JWTs (JSON Web Tokens) or session cookies for state management. User sessions are established upon successful login.

*   **Method:** NextAuth.js handles standard authentication flows (e.g., email/password).
*   **Authorization:** After authentication, API endpoints requiring authentication will expect a valid session cookie.
    *   **Header Format (for API calls requiring explicit token):** `Authorization: Bearer <token>`

## Standard Response & Pagination Formats

All API responses will adhere to a consistent structure for clarity and ease of consumption.

### Success Response

```json
// For data retrieval
{
  "success": true,
  "data": {
    // Resource object or array of objects
  }
}

// For actions without specific data return
{
  "success": true,
  "message": "Operation successful."
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_ENUM",
    "message": "A human-readable error message.",
    "details": {
      // Optional: specific validation errors, field names, etc.
    }
  }
}
```

### Pagination Format

```json
{
  "success": true,
  "data": [
    // Array of resource objects
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## API Endpoints

API endpoints are grouped by domain for clarity. Admin-specific CRUD operations for content (Patterns, Blog Posts, Portfolio Items, Shop Products) are primarily handled by the Strapi Headless CMS API directly and are not re-documented here.

### Authentication & User Management

These endpoints are primarily handled by NextAuth.js.

#### `GET /api/auth/session`

*   **Description:** Retrieves the current user's session details.
*   **Auth Level:** Guest (returns null if no session), Registered User
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "user_id_123",
          "email": "user@example.com",
          "name": "John Doe",
          "image": null
        },
        "expires": "2023-12-31T23:59:59.000Z"
      }
    }
    ```
*   **Status Codes:** `200 OK`

### Patterns

Pattern data is fetched from Strapi CMS. Custom endpoints handle user-specific actions.

#### `GET /api/patterns`

*   **Description:** Retrieves a list of all available patterns. Supports filtering.
*   **Auth Level:** Guest
*   **Request Body:** None
*   **Query Parameters:**
    *   `craftType`: `knitting` | `crochet`
    *   `difficulty`: `beginner` | `intermediate` | `advanced`
    *   `page`: Page number (default 1)
    *   `limit`: Items per page (default 10)
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "pattern_id_1",
          "title": "Cozy Scarf Pattern",
          "slug": "cozy-scarf-pattern",
          "description": "A beginner-friendly knitting pattern...",
          "craftType": "knitting",
          "difficulty": "beginner",
          "thumbnailUrl": "/images/scarf.jpg",
          "hasDownloaded": true // if authenticated user has downloaded
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
*   **Status Codes:** `200 OK`

#### `GET /api/patterns/{id}`

*   **Description:** Retrieves details for a specific pattern.
*   **Auth Level:** Guest
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "id": "pattern_id_1",
        "title": "Cozy Scarf Pattern",
        "slug": "cozy-scarf-pattern",
        "description": "Full detailed description...",
        "craftType": "knitting",
        "difficulty": "beginner",
        "thumbnailUrl": "/images/scarf.jpg",
        "fullImageUrl": "/images/scarf_full.jpg",
        "materials": ["Yarn", "Needles"],
        "tools": ["Scissors"],
        "hasDownloaded": false
      }
    }
    ```
*   **Status Codes:** `200 OK`, `404 Not Found`

#### `POST /api/patterns/{id}/download`

*   **Description:** Initiates download for a pattern. User must be authenticated.
*   **Auth Level:** Registered User
*   **Request Body:** None (User ID is taken from session)
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "downloadUrl": "https://storage.supabase.com/patterns/pattern_id_1.pdf?token=..."
      }
    }
    ```
*   **Status Codes:** `200 OK`, `401 Unauthorized`, `404 Not Found`

#### `GET /api/users/me/downloads`

*   **Description:** Retrieves the authenticated user's download history.
*   **Auth Level:** Registered User
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "patternId": "pattern_id_1",
          "title": "Cozy Scarf Pattern",
          "slug": "cozy-scarf-pattern",
          "downloadedAt": "2023-10-26T10:00:00Z",
          "thumbnailUrl": "/images/scarf.jpg"
        }
      ]
    }
    ```
*   **Status Codes:** `200 OK`, `401 Unauthorized`

### Products

Product data is fetched from Strapi CMS. Custom endpoints handle wishlist functionality.

#### `GET /api/products`

*   **Description:** Retrieves a list of all physical products available in the shop.
*   **Auth Level:** Guest
*   **Request Body:** None
*   **Query Parameters:**
    *   `page`: Page number (default 1)
    *   `limit`: Items per page (default 10)
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "product_id_1",
          "name": "Yarn Kit - Blue",
          "slug": "yarn-kit-blue",
          "description": "A complete kit for your next project...",
          "imageUrl": "/images/yarn_kit.jpg",
          "externalLink": "https://shopee.com/product/...",
          "isWishlisted": true // if authenticated user has saved it
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
*   **Status Codes:** `200 OK`

#### `GET /api/products/{id}`

*   **Description:** Retrieves details for a specific product.
*   **Auth Level:** Guest
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "id": "product_id_1",
        "name": "Yarn Kit - Blue",
        "slug": "yarn-kit-blue",
        "description": "Detailed product description...",
        "imageUrl": "/images/yarn_kit_full.jpg",
        "externalLink": "https://shopee.com/product/...",
        "isWishlisted": false
      }
    }
    ```
*   **Status Codes:** `200 OK`, `404 Not Found`

### Wishlist

#### `GET /api/wishlist`

*   **Description:** Retrieves all wishlist items for the authenticated user.
*   **Auth Level:** Registered User
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "wishlist_id_1",
          "productId": "product_id_1",
          "product": {
            "name": "Yarn Kit - Blue",
            "slug": "yarn-kit-blue",
            "imageUrl": "/images/yarn_kit.jpg",
            "externalLink": "https://shopee.com/product/..."
          },
          "createdAt": "2023-10-26T10:00:00Z"
        }
      ]
    }
    ```
*   **Status Codes:** `200 OK`, `401 Unauthorized`

#### `POST /api/wishlist`

*   **Description:** Adds a product to the user's wishlist.
*   **Auth Level:** Registered User
*   **Request Body:**
    ```json
    {
      "productId": "product_id_1"
    }
    ```
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "message": "Product added to wishlist."
    }
    ```
*   **Status Codes:** `200 OK`, `400 Bad Request` (duplicate), `401 Unauthorized`

#### `DELETE /api/wishlist/{id}`

*   **Description:** Removes an item from the user's wishlist.
*   **Auth Level:** Registered User
*   **Request Body:** None
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "message": "Product removed from wishlist."
    }
    ```
*   **Status Codes:** `200 OK`, `401 Unauthorized`, `404 Not Found`

### Coaching

#### `POST /api/coaching/request`

*   **Description:** Submits a request for one-on-one offline coaching.
*   **Auth Level:** Guest
*   **Request Body:**
    ```json
    {
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "message": "I'm interested in a beginner knitting coaching session. What are your availabilities?"
    }
    ```
*   **Response Body (200 OK):**
    ```json
    {
      "success": true,
      "message": "Your coaching request has been sent successfully. We will get back to you shortly."
    }
    ```
*   **Status Codes:** `200 OK`, `400 Bad Request` (for invalid input), `500 Internal Server Error`
