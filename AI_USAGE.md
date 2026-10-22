# AI Usage Declaration (AI_USAGE.md)

This document describes how Artificial Intelligence was leveraged during the design, implementation, and verification of the **TeamFlow** platform, in compliance with the candidate evaluation brief.

---

## 1. AI Tools Used

- **Google Gemini (Advanced Agentic Assistant / Antigravity)**: Used for architecture brainstorming, schema design, component decomposition, automated test scenario formulation, and verification of edge cases.

---

## 2. What AI Helped Produce

1. **Architecture & Schema Design**:
   - Structured the Next.js App Router component hierarchy (`Navbar`, `KanbanBoard`, `TaskTable`, `TaskModal`, `DashboardView`, `MembersTab`, `ActivityTab`, `ConfirmModal`, `ConflictModal`).
   - Modeled data structures for Users, Projects, Tasks (with Optimistic Concurrency Control versioning), Comments, and immutable Activity audit records.

2. **Core Functionality & Concurrency Control**:
   - Implemented Optimistic Concurrency Control (OCC) logic with `version` tracking to detect conflicting updates between simultaneous editors and return 409 Conflict with clear resolution paths.
   - Built the client-side data persistence engine (`mockStorage.ts`) so the entire application functions standalone with zero backend or external database configuration needed.
   - Designed server-style URL parameter synchronization for combined filters (status, priority, assignee, overdue checkbox), full-text search, and pagination.

3. **Automated Testing Suite**:
   - Synthesized integration and unit tests covering all 8 requirements specified in the evaluation brief:
     1. Authentication and session invalidation.
     2. Project isolation between teams.
     3. Owner vs. member permission matrices.
     4. Task validation and member-only assignment restrictions.
     5. Combined search, filter, sort, and pagination.
     6. Conflicting edit detection (OCC 409).
     7. Consistency between task mutations and activity history.
     8. Access revocation and assignment clearing upon member removal.
   - Formulated React Testing Library / Vitest tests for the task creation and board rendering flow.

---

## 3. How AI Outputs Were Verified

- **Static Type Safety**: Verified using strict TypeScript compilation across all models, components, and API adapters.
- **Automated Test Suites**:
  - Ran backend integration tests using `mongodb-memory-server` ensuring 100% pass rate (41/41 passing tests).
  - Executed Vitest + React Testing Library suites verifying modal submission and card rendering.
- **Production Build Verification**: Compiled the Next.js production build (`next build`) to guarantee clean server/client component boundaries, dynamic route definitions, and bundle optimizations.
- **Interactive UI Verification**: Validated authentication flows, 1-click demo account fills (Alice, Bob, Charlie, Dana), tab navigation, Kanban column updates, and filter preservation via URL query params.

---

## 4. Suggestions Corrected or Rejected

### Correction 1: Stateless JWT-Only Logout vs. Explicit Revocation
- **AI Initial Suggestion**: Use standard stateless JWTs stored on client with expiration timers, where logout merely removes the token from the client without server-side invalidation.
- **Why Rejected**: The candidate brief explicitly mandates *"Working logout that prevents reuse of the authenticated session"* and test scenario 1 requires verifying that a token cannot be reused after logout.
- **Correction Made**: Implemented explicit session tracking (`Session` model with TTL index and active status flags). When a user logs out, the active session is revoked on the database, and any subsequent request bearing that token is immediately rejected with 401 Unauthorized.

### Correction 2: Node 25 Global Web Storage Conflict in Jest
- **AI Initial Suggestion**: Run standard `jest-environment-node`.
- **Issue Encountered**: In Node 25+, `jest-environment-node` encountered a `SecurityError: Cannot initialize local storage without a --localstorage-file path` during global property enumeration.
- **Correction Made**: Created a custom test environment (`tests/custom-environment.js`) intercepting uninitialized experimental web storage on `globalThis`, enabling headless tests to execute cleanly without requiring external CLI flags.

### Correction 3: Rapid Sign-in Token Collision
- **AI Initial Suggestion**: Standard `jwt.sign({ userId, email })`.
- **Issue Encountered**: Successive logins by the same user within the exact same second generated identical token hashes, colliding with the unique database session index.
- **Correction Made**: Incorporated a cryptographically unique `jti` (JWT ID claim per RFC 7519) into every token payload via `crypto.randomUUID()`.
