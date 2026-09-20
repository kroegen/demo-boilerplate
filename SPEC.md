# SPEC — demo-boilerplate modernization

This document is the living specification for modernizing `demo-boilerplate`. It is
updated as decisions are made. It intentionally separates three concerns that must
not be mixed into a single refactor:

1. **Frontend modernization** — cleanup, config, testing, DX, dependency hygiene.
2. **Backend integration** — enabling `be-boileplate` as a second API source, migrated
   feature by feature.
3. **New application features** — e.g. editable products table, pagination, etc.

---

## 1. Audit summary (as of 2026-09-19)

### Versions / tooling
- Vue `3.5.13`, TypeScript `~5.7.3`, Vite `^6.1.0` (installed `6.1.1`)
- Pinia `^3.0.1`, Vue Router `^4.5.0`, Vitest `^3.0.5`, `@vue/test-utils ^2.4.6`
- Storybook `^8.3.3` declared (`8.5.8` actually installed — range drift)
- `vee-validate ^4.13.2`, `vue-i18n ^9.14.1`, `mitt`, `@popperjs/core`
- No `engines` field in `package.json`; CI pins Node 20, local dev tested here on Node 24.
- `package.json` `name` is still the placeholder `"test-project"`.
- `npm outdated` shows most packages have safe patch/minor updates available; a few
  (`@intlify/unplugin-vue-i18n`, `@storybook/*`, `vue-i18n`, `vue-router`, `pinia`,
  `vite`, `vite-plugin-pwa`, `typescript`) have newer **major** versions available.
  No major-version bumps are in scope for initial modernization.
- `npm install` reports 43 audit findings (4 low / 13 moderate / 22 high / 4 critical)
  and a peer-dependency conflict: `eslint-plugin-storybook@0.9.0` still expects
  ESLint `^6-8` while the project uses ESLint `9`. Needs a dedicated audit/upgrade task.

### Directory structure
Standard Vite/Vue structure: `src/api` (HTTP layer), `src/components` (common design
system + layouts + views + dialogs/modals), `src/stores` (Pinia), `src/router`,
`src/composables`, `src/locales` (vue-i18n), `src/stories` (Storybook),
`src/assets/styles`, `src/utils`. This structure is sound and is preserved.

### `ClientAPI` (`src/api/main.ts`)
Current capabilities: configurable base URL, `get/post/put/delete`, JSON and
`FormData` request bodies, in-memory bearer token.

Confirmed problems (see TODO.md for fixes):
- **Token restoration bug**: `this.authToken ?? localStorage.getItem("token")` never
  falls back to `localStorage` because `authToken` is initialized to `""`, and `""`
  is not nullish. After a page reload, the in-memory token is empty and requests are
  sent with `Authorization: Bearer ` instead of the restored token.
- **Broken GET query serialization**: `params` is serialized with `JSON.stringify`
  instead of `URLSearchParams`, producing an invalid query string
  (`?{"limit":30}` rather than `?limit=30`). Callers currently build query strings
  manually in services instead (see `ProductsService.fetchProducts`), which is a
  workaround for this bug rather than a real fix.
- **Only HTTP 200 is treated as success**; other 2xx codes (201, 204, etc.) are
  treated as errors.
- **No `PATCH` method**, needed for the products table editing feature.
- **`Content-Type: application/json` is always sent**, even for `FormData` bodies,
  which is incorrect (the browser must set the multipart boundary itself).
- **No `AbortSignal` support** for request cancellation.
- **Dead/broken error branch**: `apiError.response` is never actually set anywhere,
  so `if (apiError.response) throw await apiError.response.text();` is unreachable.
  Errors are thrown as plain `Error` objects built from `json.message`, which is
  inconsistent with a structured API error shape.
- Library code calls `console.debug`/`console.error` directly instead of leaving
  logging to the caller.

### API/service architecture
`src/api/index.ts` already implements the target container pattern (single
`ClientAPI` instance shared by all services), matching the desired end state:

```
API container (src/api/index.ts)
  └── jsonApi: ClientAPI  (hardcoded "https://dummyjson.com")
        ├── AuthService
        ├── PostsService
        ├── ProductsService
        └── UsersService
```

This is architecturally correct and will be **preserved**, extended to support a
second `backendApi: ClientAPI` instance per service, per the target described below.
`src/api/base.ts` (`Base` class doing constructor DI of `ClientAPI`) is already the
simple, correct pattern — no change needed.

Problems found:
- Base URL `"https://dummyjson.com"` is hardcoded as a string literal, not read from
  environment configuration.
- `src/components/modals/InfoModal.vue` declares `const USERS_URL =
  "https://dummyjson.com/users"` used only as an informational hyperlink shown to
  the user (not an API call, so it does not bypass the service layer). Correction
  to the initial audit: this is not dead code and is left as-is.
- Services currently only cover read operations (and `removeUser`); no
  create/update endpoints exist yet (needed for the products table editing feature).

### Authentication flow
- `authStore` (Pinia) calls `api.auth.login`, stores the returned user object in
  Pinia state, persists `token` to `localStorage`, and calls
  `api.auth.setAuthorization(token)` to set the in-memory token on the shared
  `ClientAPI` instance.
- `isLoggedIn` getter falls back to checking `localStorage.getItem("token")`
  directly, but on a fresh page load the Pinia `user` state is `null` (no
  rehydration of the user object), and — combined with the `ClientAPI` bug above —
  the in-memory bearer token is not actually restored, so authenticated requests
  after a reload would silently send an empty token.
- `logout()` clears state, clears the in-memory token, and removes the
  `localStorage` token. Router guard (`router.beforeEach`) redirects unauthenticated
  users away from `requiresAuth` routes and handles a dedicated `/admin/logout`
  route. This routing pattern is sound and preserved as-is.

### Pinia stores
`authStore`, `ProductsStore`, `usersStore`, `CartsStore`, `FavoritesStore` — all
correctly scoped, single-responsibility, using the Options-style `defineStore`.
Naming casing is inconsistent (`authStore`/`usersStore` vs `ProductsStore`/
`CartsStore`/`FavoritesStore`) — cosmetic, low priority.
`FavoritesStore` and `FavoritesView.vue` exist but the `/favorites` route is
commented out in the router — currently dead/unreachable feature code.

### Router
Two top-level layouts (`MainLayout` public storefront, `AdminLayout` gated by
`requiresAuth`). Route meta-based auth guard is simple and effective; preserved
as-is.

### PWA
`vite-plugin-pwa` configured with `generateSW`, runtime caching allow-listing
`localhost` and `dummyjson.com` hostnames. This hardcoded hostname list will need to
be extended (or generalized) once a `backendApi` base URL is introduced.
`npm run build-only` alone succeeds and produces a working precache manifest.
`dev-dist/` (the dev-mode generated service worker output) is **committed to git**
despite being build output — `.gitignore` covers `dist/`, `dist-ssr/`, `coverage`
but not `dev-dist/`.

### Storybook
`.storybook/main.ts` config is standard and functional. One story
(`src/stories/Dropdown.stories.ts`) mixes Options API `data()` with a `setup()`
return value; the template references `showDropdown`, which only exists on `data()`,
causing a `vue-tsc` type error that **breaks `npm run type-check` and therefore the
full `npm run build`** (the plain `build-only` script still works since it skips
type-checking).

### Testing
Vitest + `@vue/test-utils` + `jsdom`. Only common/design-system components have
tests (`src/components/common/__test__/*`, 15 files, 37 passed / 1 skipped). No
tests exist for: `ClientAPI`, any API service, any Pinia store, the router guard, or
`src/utils/*`. This is the largest test coverage gap.

### Build / lint / typecheck / test status (baseline, before any fix)
| Check | Command | Result |
|---|---|---|
| install | `npm install` | ✅ succeeds, with peer-dep warning + 43 audit findings |
| lint | `npm run lint` | ✅ clean |
| type-check | `npm run type-check` | ❌ fails (`Dropdown.stories.ts` TS2339) |
| unit tests | `npx vitest run` | ✅ 37 passed, 1 skipped |
| build (build-only) | `npm run build-only` | ✅ succeeds |
| build (full, `type-check` + `build-only`) | `npm run build` | ❌ fails (blocked by type-check) |

### CI / deployment (`.github/workflows/main.yml`)
Deploys to AWS S3 + CloudFront on push/PR to `master`. Notable issues:
- Explicitly deletes `package-lock.json` and runs `npm install` instead of
  `npm ci`, so CI builds are **not reproducible** from the committed lockfile.
- Runs `build-only` (not the full `build` script), so the current `type-check`
  failure does not block deployment — a real risk since broken types can ship.
- Does not run `npm run lint` at all.
- Runs `npm run test:cov`.

### Generated files committed to git
- `dev-dist/**` (service worker dev output) — should not be tracked.
- `.eslintrc.cjs` exists and is **empty** — a leftover from the pre-flat-config
  ESLint setup, now fully superseded by `eslint.config.ts`. Should be removed.

### Environment configuration
No `.env`/`.env.example` files exist anywhere in the repo. The only externally
configurable value today is the hardcoded DummyJSON base URL.

---

## 2. Target architecture

### API client / service architecture (preserved, extended)
```
class API {
  private dummyJsonApi: ClientAPI;
  private backendApi: ClientAPI;

  public auth: AuthService;
  public posts: PostsService;
  public products: ProductsService;
  public users: UsersService;

  constructor() {
    this.dummyJsonApi = new ClientAPI(import.meta.env.VITE_DUMMY_JSON_API_URL);
    this.backendApi = new ClientAPI(import.meta.env.VITE_BACKEND_API_URL);

    this.auth = new AuthService(this.dummyJsonApi);
    this.posts = new PostsService(this.dummyJsonApi);
    this.products = new ProductsService(this.dummyJsonApi);
    this.users = new UsersService(this.dummyJsonApi);

    // Migrated independently as be-boileplate gains parity:
    // this.products = new ProductsService(this.backendApi);
  }
}
```
No repository/provider/gateway layers are introduced. Feature services keep
receiving a `ClientAPI` through their constructor (`Base` class); stores and UI code
never know which base URL a service uses. This is what makes gradual, per-feature
migration to `be-boileplate` possible without touching stores or components.

### `ClientAPI` target capabilities
Configurable base URL; `GET/POST/PUT/PATCH/DELETE`; correct query serialization via
`URLSearchParams`; JSON and `FormData` bodies with correct `Content-Type` handling;
authorization header support; all HTTP 2xx codes treated as success; typed response
values; a consistent structured error shape (status, message, details); network
error handling; optional `AbortSignal`. No provider-specific (DummyJSON- or
backend-specific) logic belongs in `ClientAPI`.

### DummyJSON migration strategy
DummyJSON is **not removed**. It becomes one of two `ClientAPI` instances behind the
`API` container. Each service is migrated to `backendApi` independently, feature by
feature, starting with Products (see roadmap below). DummyJSON is only removed once
no service depends on it anymore. `be-boileplate` is never used as a proxy for
DummyJSON.

### Future `be-boileplate` integration
Expected initial contract for Products:
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```
with optional query params `page`, `limit`, `search`, `category`, `sort`, `order`.
No backend functionality is implemented from this repository — only the frontend
`ClientAPI`/service/env-config seams needed to point at it later.

### Environment configuration
```
VITE_DUMMY_JSON_API_URL=https://dummyjson.com
VITE_BACKEND_API_URL=/api
```
Provided via a committed `.env.example`; real `.env` files are git-ignored. No
secrets are ever placed in `VITE_*` variables since they are public in the built
client bundle.

### Authentication architecture
Unchanged provider (DummyJSON) for now. Fix the token-restoration bug in
`ClientAPI` so a `localStorage` token is honored again after reload. Do not
introduce refresh tokens, interceptors, or a different auth provider as part of
frontend modernization — that is backend-integration scope, deferred.

### Pinia responsibilities
Each store owns one domain's client-side state and the actions that call into its
API service; stores do not talk to `fetch`/`ClientAPI` directly. This is already
followed correctly and is preserved.

### Component architecture
`components/common` (design system, has stories + tests) → `components/layouts` →
`components/views` → `components/dialogs`/`modals`. Preserved as-is. The first new
feature (editable product rows) is added within this structure without introducing
new architectural layers.

### Shared product grid and Favorites page
The full product-card grid and its optional drag interaction belong in a shared
component. `LandingView` owns fetching, category routing, loading, and pagination;
`FavoritesView` reads the existing in-memory `FavoritesStore` and disables drag.
The header keeps its compact `ProductListItem` dropdown. Both pages use the same
full `ProductCard` controls, and neither duplicates product-card markup.

### Validation
`vee-validate` is already used for form validation (`LoginView`); this remains the
validation approach for new forms (e.g. product edit fields) rather than introducing
a second validation library.

### Error handling
Standardize on structured errors surfaced from `ClientAPI` (status + message) so
that stores/components can render meaningful error state without parsing raw
`Error` message strings.

### Loading / empty states
Existing `SpinnerLoader` component is reused for new loading states (e.g. product
row save-in-progress). Empty/error states for lists are addressed as their own
scoped TODOs, not bundled with unrelated changes.

### Testing strategy
Keep Vitest + Vue Test Utils. Priority order for new tests: `ClientAPI` (transport
correctness) → services → stores → router guard → new UI (table editing) behavior
(edit/cancel/save success/save failure).

### PWA strategy
Keep `vite-plugin-pwa`. Runtime-caching hostname allow-list is generalized (or
extended) once `VITE_BACKEND_API_URL` exists, so caching isn't hardcoded to
`dummyjson.com` only.

### CI strategy
Use `npm ci` instead of deleting the lockfile, run the full `build` (including
`type-check`) and `lint` in CI so regressions are caught before deploy.

### Deployment strategy
Unchanged: static production build deployed to S3 + CloudFront. No Docker is
introduced for the frontend.

### Future feature roadmap (illustrative order, not committed all at once)
1. Editable product rows (admin table) — see TODO.md.
2. Product create / delete with confirmation flow.
3. Pagination, server-side search, sorting, category filtering for products.
4. Product loading/empty/error states, product detail screen.
5. Gradual Users backend migration (list/detail/create/edit/disable/roles).
6. Auth migration to `be-boileplate` once its auth contract exists.

---

## 3. Modernization principles (recap)
Preserve behavior and existing sound architecture; small independently-verifiable
steps; no bundling of unrelated changes; no `any`/`@ts-ignore`/disabled lint rules to
force a pass; prefer removing unused dependencies over upgrading speculatively; keep
the app runnable and verified after every step. See TODO.md for the phased task list.
