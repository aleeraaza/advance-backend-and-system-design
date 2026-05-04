## 🧠 Detailed Techniques Used (Learning Reference)

### 1. Modular, Layered Architecture
*   **Pattern Used:** Controller-Service-Repository Pattern.
*   **Why it's advanced:** It strictly enforces the Single Responsibility Principle (SRP). 
    *   **Controllers** (`auth.controller.ts`) only deal with extracting the Request and sending the Response.
    *   **Services** (`auth.service.ts`) hold the actual business rules (e.g., checking if a user exists, hashing passwords).
    *   **Repositories** (`auth.repository.ts`) act as the Data Access Layer (DAL). The service doesn't care *how* data is saved (Prisma vs. raw SQL), it just calls the repository.

### 2. Request Validation & Type Inference (Zod)
*   **Pattern Used:** Schema-based validation middleware.
*   **Why it's advanced:** Instead of manual `if (!email)` checks, you created a reusable `validate.middleware.ts` that safely parses `req.body` against a Zod schema (`auth.schema.ts`). If it fails, it short-circuits with a formatted 400 response. If it passes, TypeScript automatically knows the exact shape of the DTO (Data Transfer Object).

### 3. Centralized Asynchronous Error Handling
*   **Pattern Used:** `catchAsync` wrapper + Global Error Middleware.
*   **Why it's advanced:** 
    *   `catchAsync.ts` eliminates the need to wrap every controller in a `try/catch` block. It automatically catches Promise rejections and passes them to `next()`.
    *   `globalErrorHandler.ts` handles formatting the error response. It checks if the environment is `development` (to send the full stack trace) or `production` (to send a clean, user-friendly message).
    *   `AppError.ts` allows you to throw operational errors (e.g., `throw new AppError("User exists", 400)`) with specific HTTP status codes.

### 4. Advanced Authentication Security
*   **Pattern Used:** Access & Refresh Tokens.
*   **Why it's advanced:** Basic apps use a single JWT. This project uses two:
    *   A short-lived **Access Token** (1 day) for authenticating API requests.
    *   A long-lived **Refresh Token** (7 days) stored in the database (`authRepository.refreshToken`). This allows for revoking sessions and keeps the user logged in without compromising security if the access token is intercepted.
    *   Passwords are securely salted and hashed using `bcrypt` before ever reaching the database.

### 5. Data Mappers & DTOs
*   **Pattern Used:** Data Mapper Pattern.
*   **Why it's advanced:** The database returns the full User object (including the hashed password). Instead of sending this directly to the client, you use `toUserResponse` in `auth.mapper.ts` to strip out sensitive data and map it to a specific `UserResponseType` interface. This prevents accidental data leaks.

### 6. Standardized API Responses
*   **Pattern Used:** Consistent Response Wrapping.
*   **Why it's advanced:** Using `sendResponse.ts`, every single API endpoint returns the exact same structural contract (`success`, `message`, `data`). This makes frontend consumption incredibly predictable and reliable.

### 7. Modern ORM Integration
*   **Pattern Used:** Prisma with PostgreSQL.
*   **Why it's advanced:** Prisma provides an auto-generated, type-safe query builder. By keeping the Prisma client instance centralized (`prisma.ts`), you ensure a single database connection pool is used across the entire application.
