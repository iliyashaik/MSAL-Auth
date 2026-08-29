# MSAL OAuth 2.0 — React + TypeScript + Vite

A React application demonstrating Microsoft Authentication Library (MSAL) OAuth 2.0 login flow using `@azure/msal-browser`.

---

## Tech Stack

- React 18 + TypeScript
- Vite
- [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser)

---

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. In `src/authConfig.ts`, replace the placeholder values with your Azure AD app registration details:
   ```ts
   clientId: "YOUR_CLIENT_ID",
   authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
   redirectUri: "http://localhost:3994",
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## Authentication Flow

### Overview

```
App loads
  └─ pca.initialize()
  └─ handleRedirectPromise() → null (first visit, nothing to do)

User fills form + clicks Submit
  └─ pca.loginRedirect()
  └─ browser navigates to Microsoft login page

User signs in on Microsoft page
  └─ Microsoft redirects back to localhost:3994?code=...

App reloads
  └─ handleRedirectPromise() → AuthenticationResult (account + tokens)
  └─ MSAL caches tokens in sessionStorage
  └─ acquireTokenSilent() → fresh accessToken
  └─ TODO: call your API with the token
```

---

### Step 1 — App loads, MSAL initializes

```ts
const pca = new PublicClientApplication(createMSALInstance())
```

A single MSAL client is created once at module level using the config from `authConfig.ts` (`clientId`, `authority`, `cacheLocation: "sessionStorage"`).

---

### Step 2 — `useEffect` runs once on mount

```ts
pca.initialize().then(() => pca.handleRedirectPromise())
```

- `initialize()` — boots up MSAL, reads any existing session from `sessionStorage`.
- `handleRedirectPromise()` — checks if the browser just returned from a Microsoft login redirect.

**First visit (no login yet):** returns `null` — MSAL stays idle.

**After login redirect returns:** returns an `AuthenticationResult` with the account and tokens.

---

### Step 3 — User clicks Submit

```ts
await pca.loginRedirect(loginRequest)
```

- The form validates that email and password fields are filled.
- `loginRedirect({ scopes: ['User.Read'] })` navigates the browser to Microsoft's login page.

Example URL the browser goes to:
```
https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize
  ?client_id=<clientId>
  &scope=User.Read
  &redirect_uri=http://localhost:3994
  &response_type=code
```

---

### Step 4 — Microsoft redirects back

Microsoft sends the user back to `http://localhost:3994` with a `code` in the URL:
```
http://localhost:3994/?code=0.AX8A...&state=...
```

The page reloads and `useEffect` runs again. `handleRedirectPromise()` picks up the code, exchanges it for tokens, and returns:

```ts
{
  account: { username: "user@company.com", homeAccountId: "..." },
  accessToken: "eyJ0eXAiOiJKV1Q...",
  idToken: "eyJ0eXAiOiJKV1Q...",
  scopes: ["User.Read"]
}
```

MSAL stores this in `sessionStorage` automatically.

---

### Step 5 — `acquireTokenSilent()`

```ts
const account = response?.account ?? pca.getAllAccounts()[0]
pca.acquireTokenSilent({ scopes: apiRequest.scopes, account })
```

- **Token is fresh:** MSAL returns it from `sessionStorage` without a network call.
- **Token is expired:** MSAL silently uses the refresh token to get a new one from Microsoft.

Result:
```ts
tokenResponse.accessToken // "eyJ0eXAiOiJKV1Q..." — ready to use
```

---

### Step 6 — Use the token to call your API

Replace the `TODO` comment in `App.tsx` with:

```ts
fetch('http://localhost:4000/api/profile', {
  headers: {
    Authorization: `Bearer ${tokenResponse.accessToken}`
  }
})
```

Your backend reads the `Authorization` header and validates the token against Azure AD.

---

## Project Structure

```
src/
  App.tsx         — Login UI + MSAL lifecycle (redirect, token acquisition)
  authConfig.ts   — MSAL configuration (clientId, authority, scopes, cache)
  App.css         — Login form styles
  main.tsx        — React app entry point
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/authConfig.ts` | Azure AD app config, login scopes, API scopes |
| `src/App.tsx` | Login form, MSAL init, redirect handling, silent token acquisition |
