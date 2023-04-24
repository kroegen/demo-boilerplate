# test-project

This is a demo vue3 + ts boilerplate project made to cover the dummyJSON api with UI

## Project Setup

```sh
npm install
```
### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Optional: install pm2 globally

```sh
npm i pm2 -g
```

## Preview

```sh
npm run preview
```

## Preview with pm2

```sh
pm2 start pm2.json
```

## Current main features

- [x] All labels made with i18n for future internationalization support
- [x] Client-side API made as a wrapper around Fetch API method. Can be easiley changed to axios or whatever.
- [x] Simple input component with error state, different sizes + before/after/ slots for icons + clear icon option prop
- [x] Simple Login form validation with vee-validate
- [x] Simple button component with props for size/variants
- [x] Modals/dialogs/snack notifications components
- [x] svg-icon component
- [x] Data flow through Pinia store on Users page
- [x] All icons are from remix icon pack https://remixicon.com/

# TODO list of improvements and possible features

- [ ] Table component, header config for table as a prop, list items in single slot
- [ ] Categories page -> Products by category > Product page
- [ ] Comments, posts
- [ ] Auto-minimization of sidebar
- [ ] Listing search, pagination
- [ ] Login with google account?
- [ ] Initial mobile and tablet support (responsive styles)
- [ ] Github actions to automate the deploy
- [ ] Storybook for common components
- [ ] Initial unit tests setup
- [ ] Initial E2E tests setup
- [ ] Detailed user page
- [ ] Dropdowns + Select component (might be with popper.js)
- [ ] Add some other language support, add dropdown with options
- [ ] Edit user info on user's page
- [ ] Cover all buiseness logic on all pages with E2E tests
- [ ] 80% code coverege
