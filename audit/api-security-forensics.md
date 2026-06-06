# Red Team Audit: API & Security Forensics

## Security Risk Assessment: CRITICAL

### 1. Prompt Injection Vulnerability
All AI routes (`/api/ai/*`, `/api/workflows/*`) are highly vulnerable.
- **Evidence:** `src/lib/utils/security.ts` uses a weak list of 6 regex patterns.
- **Attack Vector:** An attacker can use base64 encoding, foreign languages, or complex role-play wrappers to bypass the regex and gain full control over the system prompts.

### 2. Authentication & Authorization
- **Risk:** No refresh token logic. Sessions are short-lived or permanently open if not cleared.
- **Risk:** Admin routes check `decoded.role === 'admin'`. However, there is no centralized permission management.
- **Vulnerability:** `localStorage` storage of JWTs makes them accessible to XSS attacks.

### 3. Input Validation
- **Status:** Partial.
- **Evidence:** Zod is used in some routes (`auth/register`, `tools/post`), but missing in others (`ai/chat`, `community/threads`).
- **Risk:** Malicious payloads can crash the worker or perform NoSQL injection where Zod is absent.

### 4. Rate Limiting
- **Status:** Mocked for Enterprise only.
- **Evidence:** `/api/enterprise` has a hardcoded limit of 10 requests per minute. Global rate limiting is handled by a standard Express middleware which may not work correctly in a serverless Next.js environment without a centralized Redis store (the Redis store is initialized but not consistently applied).

### 5. Broken / Missing APIs
- **Broken:** `marketplace/order` logic sends a "purchase" note but the webhook doesn't actually trigger any "delivery" mechanism for digital goods. It just flips a flag in the DB.
- **Missing:** Password reset, email verification, account deletion, and subscription cancellation APIs are completely non-existent.
- **Unused:** `validators.ts` from the old Express server is still in the repo but unused in the Next.js app.
