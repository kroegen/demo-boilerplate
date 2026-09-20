# TODO — demo-boilerplate modernization

Phased, small, independently verifiable tasks. Check items off as completed and
update this file immediately after finishing each one. If work reveals unrelated
issues, add a new TODO instead of expanding the current one.

Legend: each task lists its expected result and a suggested verification command.

---

## Phase 0 — Repo hygiene (safe, isolated cleanups)

- [x] Remove empty legacy `.eslintrc.cjs`.
      Expected result: file deleted; `eslint.config.ts` remains the only ESLint
      config. Verify: `npm run lint`.
- [x] Add `dev-dist/` to `.gitignore` and remove it from git tracking.
      Expected result: `dev-dist/` no longer committed; still generated locally by
      `vite dev`/PWA dev options. Verify: `git status` clean after `npm run dev`.
- [x] Rename `package.json` `name` from `"test-project"` to the real project name.
      Expected result: no other references to the old name remain.
      Verify: `grep -r "test-project" .` (excluding lockfile) returns nothing
      relevant.
- [x] ~~Remove unused `USERS_URL` constant~~ — audit correction: `USERS_URL` in
      `src/components/modals/InfoModal.vue` is actually used as an informational
      hyperlink in the template (not dead code, not an API-layer bypass). No
      change made; initial audit note was inaccurate.

## Phase 1 — Environment configuration

- [x] Add `VITE_DUMMY_JSON_API_URL` and `VITE_BACKEND_API_URL` to a new
      `.env.example`; document them in `README.md`.
      Expected result: `.env.example` committed, `.env*` (except `.env.example`)
      git-ignored.
- [x] Move the hardcoded `"https://dummyjson.com"` base URL in `src/api/index.ts`
      to `import.meta.env.VITE_DUMMY_JSON_API_URL`.
      Expected result: app behavior unchanged when `.env` sets the same value.
      Verify: `npm run dev`, confirm products/users/posts/login still load.
- [x] Add a (currently unused) `backendApi: ClientAPI` instance to the `API`
      container wired to `VITE_BACKEND_API_URL`, without assigning any service to
      it yet.
      Expected result: container compiles and app behavior is unchanged; no
      service uses `backendApi` yet. Verify: `npm run type-check`, `npx vitest run`.

## Phase 2 — `ClientAPI` correctness fixes

- [x] Fix token restoration fallback: `this.authToken ?? localStorage.getItem("token")`
      never falls back because `authToken` defaults to `""`. Change the check so an
      empty in-memory token still allows falling back to a stored token.
      Expected result: after a hard reload with a valid `localStorage` token,
      authenticated requests include the restored bearer token.
      Verify: add a `ClientAPI` unit test covering this case.
- [x] Fix GET query serialization to use `URLSearchParams` instead of
      `JSON.stringify(params)`.
      Expected result: `client.get(url, { limit: 30, skip: 0 })` produces
      `url?limit=30&skip=0`. Update `ProductsService.fetchProducts` to pass a
      params object instead of manually building the query string.
      Verify: new `ClientAPI` test + existing products list still loads in `npm run dev`.
- [x] Treat every HTTP 2xx response as success (not only `200`).
      Expected result: `201`/`204`/etc. responses are returned normally instead of
      throwing. Verify: `ClientAPI` unit test with a mocked `204` response.
- [x] Add a `patch` method to `ClientAPI` (needed for Phase 8 product editing).
      Expected result: `client.patch(url, payload)` sends a `PATCH` request with a
      JSON body. Verify: `ClientAPI` unit test.
- [x] Fix `Content-Type` header handling so it is omitted (or set correctly) for
      `FormData` bodies instead of always sending `application/json`.
      Expected result: FormData uploads are not mislabeled. Verify: `ClientAPI`
      unit test asserting no `Content-Type` header is set for `FormData` payloads.
- [x] Introduce a structured API error shape (e.g. `{ status, message, details? }`)
      thrown by `ClientAPI` on non-2xx responses and on network failures, replacing
      the current inconsistent `throw new Error(json.message)` /
      `throw await apiError.response.text()` (dead branch) logic.
      Expected result: callers can rely on a single error shape.
      Verify: `ClientAPI` unit tests for HTTP error and network error cases.
- [x] Add optional `AbortSignal` support to all `ClientAPI` methods.
      Expected result: passing a signal aborts the in-flight `fetch`.
      Verify: `ClientAPI` unit test using an already-aborted `AbortController`.
- [x] Remove direct `console.debug`/`console.error` calls from `ClientAPI` request
      logic (leave logging to callers, or gate behind a debug flag).
      Expected result: no unconditional console output from the HTTP layer during
      normal operation. Verify: `npx vitest run`, manual `npm run dev` smoke check.
- [x] Add a dedicated `src/api/__test__/main.test.ts` covering the above `ClientAPI`
      behaviors end-to-end (this may already be partially covered by the tasks
      above — consolidate into one test file).
      Expected result: `ClientAPI` has direct unit test coverage.
      Verify: `npx vitest run`.

## Phase 3 — Type-check / build fix

- [x] Fix `src/stories/Dropdown.stories.ts` `showDropdown` typing error (align
      `data()`/`setup()` usage so `vue-tsc` can resolve the template's
      `showDropdown` reference).
      Expected result: `npm run type-check` passes.
      Verify: `npm run type-check`, then `npm run build`.

## Phase 4 — CI hardening

- [x] Replace `rm -rf node_modules package-lock.json && npm install` with
      `npm ci` in `.github/workflows/main.yml`.
      Expected result: CI installs are reproducible from the committed lockfile.
- [x] Run the full `npm run build` (includes type-check) instead of
      `npm run build-only` in CI, and add a separate `npm run lint` step.
      Expected result: CI fails on type errors or lint errors before deploying.
      Verify: push to a branch / open a PR and confirm the workflow runs both steps.
- [x] Pass the public API base URLs from `.env.example` to the CI build.
      Expected result: the deployed bundle uses the same DummyJSON URL as local
      development even though CI has no local `.env` file.

## Phase 5 — Dependency hygiene

- [x] Run `npm audit` and evaluate reported vulnerabilities; apply safe
      non-breaking fixes only (`npm audit fix` without `--force`), documenting any
      that require a major bump as a separate future TODO.
      Expected result: fewer/no vulnerabilities fixable without breaking changes;
      no version left unexplained.
- [x] Resolve the `eslint-plugin-storybook` peer-dependency warning against
      ESLint 9 (upgrade the plugin if a compatible release exists, otherwise
      document the constraint).
      Expected result: `npm install` no longer warns about this conflict, or the
      constraint is explicitly documented if unresolved.
- [x] Align declared Storybook package versions in `package.json` with the
      installed `8.6.x` versions actually resolved (or intentionally re-pin), to
      remove the version-range drift noted in the audit.
      Expected result: `npm install` produces no changes; declared ranges match
      reality.
- [x] Re-confirm the Favorites feature direction. `FavoritesStore` is already used
      by product heart controls and the header dropdown; `FavoritesView` is a
      placeholder and its route is disabled. Build the full page from the shared
      product grid in Phase 7, keeping the existing store and dropdown.

## Phase 6 — Products backend-migration seam (frontend-only prep)

- [x] Add `create`/`update` (`PATCH`)/`delete` methods to `ProductsService`,
      still targeting `dummyJsonApi` (DummyJSON supports mock CRUD responses).
      Expected result: `ProductsService.updateProduct(id, payload)` etc. available
      for the table-editing feature, without touching `backendApi` yet.
      Verify: `ProductsService` unit tests using a mocked `ClientAPI`.

## Phase 7 — Shared product grid and Favorites page

Each item below is its own reviewable step; keep existing landing behavior while
extracting the shared display structure.

- [x] Define the shared component boundary: the grid owns the product-card layout
      and optional drag interaction; each view owns its data source, loading state,
      and page-specific controls. Record the contract in `SPEC.md`.
      Verify: the plan leaves landing pagination and category routing in
      `LandingView`, and the header's compact `ProductListItem` dropdown separate.
- [x] Move `ProductCard`, `FavoriteButton`, and `RatingStars` out of the
      `LandingView` directory into a shared product-component location; update
      imports without changing their behavior. Verify: `npm run type-check` and
      `npx vitest run`.
- [x] Extract the full-card grid markup and styles from `LandingView`
      into a shared product-grid component that accepts `Product[]`. Keep the
      existing card actions and list transition. Verify: the landing page renders
      the same cards and responsive layout.
- [x] Move landing drag/reorder handling behind the grid's explicit props and
      event contract. Make card dragging conditional on that prop, let the owning
      view apply the reordered list, and remove the `DataTransfer` type cast used
      for the card's drag payload. Verify: dragging still reorders landing cards,
      with a focused interaction test.
- [x] Switch `LandingView` to the shared grid while leaving its fetch, category,
      loading, and pagination logic in the view. Verify: landing and category
      routes still load and paginate as before.
- [x] Replace the `FavoritesView` loading placeholder with the same shared card
      grid backed by `FavoritesStore.favorites`; do not fetch products again.
      Verify: add/remove actions update both the page and header dropdown
      immediately, including after navigating between views.
- [x] Disable drag reordering in `FavoritesView` through the grid's prop; keep
      the current `FavoritesStore` order. Verify: favorite cards cannot be dragged
      and removing one leaves the remaining order unchanged.
- [x] Add an empty Favorites state and translations in both supported locales.
      Verify: the page is clear when the store has no favorites and updates when
      the first item is added.
- [x] Enable the `/favorites` route under `MainLayout` and provide a visible path
      to it while preserving the header's existing dropdown behavior. Verify:
      direct navigation, browser back/forward, and mobile layout.
- [x] Add focused component and route tests for shared card rendering, Favorites
      add/remove synchronization, disabled dragging, empty state, and route
      access. Verify: `npx vitest run`, `npm run type-check`, `npm run build`,
      and `npm run lint`.

## Phase 8 — First major UI feature: editable product rows (admin table)

Each item below is its own reviewable step; do not combine them.

- [x] Audit current `ProductsTable.vue` and `ProductsTableItem.vue` responsibilities
      and document the intended edit/display mode boundary (comment or short note
      in SPEC.md), no behavior change.
- [x] Add explicit display/edit mode state to a product row (no editable fields
      yet, just the mode toggle and conditional rendering scaffold).
- [ ] Add an "Edit" action that switches a row into edit mode.
- [ ] Add a "Cancel" action that reverts a row to display mode without saving.
- [ ] Add an editable `title` field.
- [ ] Add an editable `price` field.
- [ ] Add an editable `stock` field.
- [ ] Add category editing (select bound to existing categories data).
- [ ] Add client-side validation for the editable fields (reuse `vee-validate`).
- [ ] Wire the row's "Save" action to `ProductsService.updateProduct` (DummyJSON
      target for now).
- [ ] Add a save loading state on the row.
- [ ] Add a save error state on the row (uses the structured `ClientAPI` error
      shape from Phase 2).
- [ ] Update `ProductsStore`/local row state with the saved values after a
      successful update.
- [ ] Add a success notification (reuse `FancySnack`).
- [ ] Add a failure notification (reuse `FancySnack`).
- [ ] Add component tests for edit/cancel interactions.
- [ ] Add component tests for a successful update.
- [ ] Add component tests for a failed update.

Design constraint: switching `this.products = new ProductsService(dummyJsonApi)` to
`new ProductsService(backendApi)` later must not require any change to
`ProductsTable`/`ProductsTableItem`.

## Phase 9 — Later product features (separate phases, not started yet)

- [ ] Create product flow.
- [ ] Delete product flow with confirmation modal (reuse `ConfirmModal.vue`).
- [ ] Pagination backed by real `page`/`limit` params via the fixed `ClientAPI`
      query serialization.
- [ ] Server-side search.
- [ ] Sorting.
- [ ] Category filtering.
- [ ] Product list loading state.
- [ ] Product list empty state.
- [ ] Product list API error state.
- [ ] Product detail screen.

## Phase 10 — Users (deferred, DummyJSON-first)

- [ ] User list backend-readiness review (no change yet).
- [ ] User detail view.
- [ ] Create user.
- [ ] Edit user.
- [ ] Disable/delete user.
- [ ] Roles support.

## Phase 11 — Backend integration (deferred, not implemented in this repo)

- [ ] Point `ProductsService` at `backendApi` once `be-boileplate` exposes the
      documented `/api/products` contract (first domain to migrate).
- [ ] Re-run Products test suite against the backend-backed service to confirm the
      table-editing feature required no changes.
- [ ] Evaluate migrating `UsersService`/`AuthService`/`PostsService` similarly, one
      at a time, only after Products migration is verified stable.
- [ ] Remove DummyJSON entirely once no service depends on it.

## Deferred dependency upgrades

- [ ] Evaluate a coordinated Vitest and `@vitest/coverage-v8` major upgrade to
      address the remaining `@vitest/mocker` advisory. `npm audit fix` reports
      that this requires Vitest 5 and cannot be applied within the current range.
- [ ] Resolve the `uuid` advisory through a supported Storybook addon upgrade.
      `npm audit fix` proposes an incompatible `@storybook/addon-essentials`
      version change; assess the Storybook migration separately.
