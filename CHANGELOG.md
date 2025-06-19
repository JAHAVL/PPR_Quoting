# Changelog

## [0.0.1] - 2025-06-18

### Added
- **Quote Generation:** Implemented initial quote generation functionality on the `install-quote` page.
- **Quote Viewing:** Implemented quote viewing on the `view-quote` page.
- **Quote Persistence:**
    - Quotes generated are now passed to the `view-quote` page via `sessionStorage`.
    - Quotes are automatically saved to the database when first viewed if loaded from `sessionStorage`.
    - Implemented logic to automatically find or create a "Walk-in Customer" if no client is selected, ensuring quotes can always be saved.
    - After saving, the URL on `view-quote` is updated with the new quote's ID.
    - The main quotes list (via `QuotesContext`) is refreshed after a new quote is saved.
- **Client Selection on View Quote:** The client selection dropdown on the `view-quote` page is now always visible, allowing users to change the client associated with a quote even after an auto-save.
- **Debugging & Verification:** Added console logs in `view-quote.tsx` to compare data sent to the API vs. data retrieved from the database for new quotes.
- **Navigation:** Root path (`/`) now automatically redirects to `/install-quote`.

### Fixed
- Resolved issues where newly created quotes were not displaying correctly or were lost due to React Strict Mode and hot-reloading.
- Addressed backend validation errors for missing `clientId`, `title`, and `total` by ensuring these are provided during quote creation.
- Corrected various JSX syntax errors and UI bugs on the `view-quote` page, particularly related to client selection and overall page rendering.

### Changed
- Refactored `saveQuoteToDatabase` in `view-quote.tsx` for robustness, including default client handling and improved error messaging.
- Modified `useEffect` in `view-quote.tsx` to prioritize loading quotes from `sessionStorage` and manage state more effectively with `useRef` flags.
- Replaced the entire `return` statement in `view-quote.tsx` to resolve persistent JSX structural issues.
