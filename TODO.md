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
- [x] Add a `patch` method to `ClientAPI` (needed for Phase 6 product editing).
      Expected result: `client.patch(url, payload)` sends a `PATCH` request with a
      JSON body. Verify: `ClientAPI` unit test.
- [x] Fix `Content-Type` header handling so it is omitted (or set correctly) for
      `FormData` bodies instead of always sending `application/json`.
      Expected result: FormData uploads are not mislabeled. Verify: `ClientAPI`
      unit test asserting no `Content-Type` header is set for `FormData` payloads.
- [ ] Introduce a structured API error shape (e.g. `{ status, message, details? }`)
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
- [ ] Add a dedicated `src/api/__test__/main.test.ts` covering the above `ClientAPI`
      behaviors end-to-end (this may already be partially covered by the tasks
      above — consolidate into one test file).
      Expected result: `ClientAPI` has direct unit test coverage.
      Verify: `npx vitest run`.

## Phase 3 — Type-check / build fix

- [ ] Fix `src/stories/Dropdown.stories.ts` `showDropdown` typing error (align
      `data()`/`setup()` usage so `vue-tsc` can resolve the template's
      `showDropdown` reference).
      Expected result: `npm run type-check` passes.
      Verify: `npm run type-check`, then `npm run build`.

## Phase 4 — CI hardening

- [ ] Replace `rm -rf node_modules package-lock.json && npm install` with
      `npm ci` in `.github/workflows/main.yml`.
      Expected result: CI installs are reproducible from the committed lockfile.
- [ ] Run the full `npm run build` (includes type-check) instead of
      `npm run build-only` in CI, and add a separate `npm run lint` step.
      Expected result: CI fails on type errors or lint errors before deploying.
      Verify: push to a branch / open a PR and confirm the workflow runs both steps.

## Phase 5 — Dependency hygiene

- [ ] Run `npm audit` and evaluate reported vulnerabilities; apply safe
      non-breaking fixes only (`npm audit fix` without `--force`), documenting any
      that require a major bump as a separate future TODO.
      Expected result: fewer/no vulnerabilities fixable without breaking changes;
      no version left unexplained.
- [ ] Resolve the `eslint-plugin-storybook` peer-dependency warning against
      ESLint 9 (upgrade the plugin if a compatible release exists, otherwise
      document the constraint).
      Expected result: `npm install` no longer warns about this conflict, or the
      constraint is explicitly documented if unresolved.
- [ ] Align declared Storybook package versions in `package.json` with the
      installed `8.5.x` versions actually resolved (or intentionally re-pin), to
      remove the version-range drift noted in the audit.
      Expected result: `npm install` produces no changes; declared ranges match
      reality.
- [ ] Re-confirm the `FavoritesStore`/`FavoritesView` route is intentionally
      disabled; either wire the commented-out `/favorites` route back up or remove
      the dead store/view if it is not planned. (Decision only — do not silently
      delete without confirming with the user.)
      Expected result: no orphaned store/view left ambiguous in the codebase.

## Phase 6 — Products backend-migration seam (frontend-only prep)

- [ ] Add `create`/`update` (`PATCH`)/`delete` methods to `ProductsService`,
      still targeting `dummyJsonApi` (DummyJSON supports mock CRUD responses).
      Expected result: `ProductsService.updateProduct(id, payload)` etc. available
      for the table-editing feature, without touching `backendApi` yet.
      Verify: `ProductsService` unit tests using a mocked `ClientAPI`.

## Phase 7 — First major UI feature: editable product rows (admin table)

Each item below is its own reviewable step; do not combine them.

- [ ] Audit current `ProductsTable.vue` and `ProductsTableItem.vue` responsibilities
      and document the intended edit/display mode boundary (comment or short note
      in SPEC.md), no behavior change.
- [ ] Add explicit display/edit mode state to a product row (no editable fields
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

## Phase 8 — Later product features (separate phases, not started yet)

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

## Phase 9 — Users (deferred, DummyJSON-first)

- [ ] User list backend-readiness review (no change yet).
- [ ] User detail view.
- [ ] Create user.
- [ ] Edit user.
- [ ] Disable/delete user.
- [ ] Roles support.

## Phase 10 — Backend integration (deferred, not implemented in this repo)

- [ ] Point `ProductsService` at `backendApi` once `be-boileplate` exposes the
      documented `/api/products` contract (first domain to migrate).
- [ ] Re-run Products test suite against the backend-backed service to confirm the
      table-editing feature required no changes.
- [ ] Evaluate migrating `UsersService`/`AuthService`/`PostsService` similarly, one
      at a time, only after Products migration is verified stable.
- [ ] Remove DummyJSON entirely once no service depends on it.
