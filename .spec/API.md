# API.md: Nurea Knit

## Authentication & Authorization

Authentication is managed using Supabase Auth, which uses HTTP-only cookies for session management.

- **Method:** Supabase Auth handles email/password authentication flows.
- **Authorization:** API endpoints requiring authentication check the Supabase session via the server client.
- **Session:** Automatically managed via Supabase SSR client; tokens are refreshed automatically.

## Standard Response & Pagination Formats

All API responses adhere to a consistent structure.

### Success Response
```json
{
  "success": true,
  "data": {}
}

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
    "details": {}
  }
}
```

### Pagination Format
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## API Endpoints

### Authentication (Supabase Auth)

Auth operations use Supabase client SDK on the frontend, not custom API routes.

| Operation | Method | SDK Call | Description |
|:---|:---:|:---|:---|
| Register | Client | `supabase.auth.signUp()` | Create new user account |
| Login | Client | `supabase.auth.signInWithPassword()` | Authenticate user |
| Logout | Client | `supabase.auth.signOut()` | End session |
| Get Session | Client/Server | `supabase.auth.getSession()` | Get current session |
| Get User | Client/Server | `supabase.auth.getUser()` | Get current user |
| Reset Password | Client | `supabase.auth.resetPasswordForEmail()` | Send password reset email |

### Patterns

Pattern data is fetched from Payload CMS via Next.js server components (Local API).

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/api/patterns` | GET | Fetch all patterns with filters. Supports query params: `craftType`, `difficulty`, `page`, `limit` |
| `/api/patterns/[id]` | GET | Fetch single pattern by ID or slug |
| `POST /api/patterns/[id]/download` | POST | Initiate pattern download. Requires authentication. Returns signed URL from Supabase Storage. |

**Response (GET /api/patterns):**
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
      "hasDownloaded": true
    }
  ],
  "pagination": {}
}
```

**Response (POST /api/patterns/[id]/download):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://storage.supabase.com/patterns/pattern_id_1.pdf?token=..."
  }
}
```

### Products

Product data is fetched from Payload CMS.

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/api/products` | GET | Fetch all products with pagination |
| `/api/products/[id]` | GET | Fetch single product by ID or slug |

### Wishlist

| Endpoint | Method | Auth Required | Description |
|:---|:---:|:---:|:---|
| `/api/wishlist` | GET | ✅ | Fetch user's wishlist items |
| `/api/wishlist` | POST | ✅ | Add product to wishlist |
| `/api/wishlist/[id]` | DELETE | ✅ | Remove item from wishlist |

**POST /api/wishlist:**
```json
{
  "productId": "product_id_1"
}
```

### Coaching

| Endpoint | Method | Auth Required | Description |
|:---|:---:|:---:|:---|
| `/api/coaching` | POST | No | Submit coaching request. Sends email to admin via Resend. |

**POST /api/coaching:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "message": "I'm interested in coaching."
}
```

### User Profile

| Endpoint | Method | Auth Required | Description |
|:---|:---:|:---:|:---|
| `/api/users/me/downloads` | GET | ✅ | Fetch user's download history |
| `/api/users/me/settings` | PATCH | ✅ | Update user profile (name, email) |
| `/api/users/me/password` | PATCH | ✅ | Update password |

## Payload CMS Admin API

Payload CMS automatically generates REST APIs for all collections at `/api/{collection}`. These are primarily used by the admin panel and can be consumed by the frontend.

**Auto-generated endpoints:**
- `GET /api/patterns`, `POST /api/patterns`, etc.
- `GET /api/posts`, `POST /api/posts`, etc.
- `GET /api/products`, `POST /api/products`, etc.
- `GET /api/portfolio`, `POST /api/portfolio`, etc.
- `GET /api/coaching-requests`, `POST /api/coaching-requests`, etc.

## Status Codes

| Code | Description |
|:---:|:---|
| 200 | Success |
| 201 | Created (resource created) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |
