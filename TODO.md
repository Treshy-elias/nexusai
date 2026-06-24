# Theme redesign TODO (Claude-like calm, warm paper)

- [ ] Step 1: Update `app/globals.css` with semantic CSS variables (light + dark) using the provided palette.
- [ ] Step 2: Make base `body` / selection / borders use tokens for consistent readability.
- [ ] Step 3: Update layout shell (`app/(dashboard)/layout.tsx` and any other wrappers) to rely on tokens.
- [ ] Step 4: Refactor Sidebar styles (`components/layout/Sidebar.tsx`) to replace gray/violet utilities with token-backed semantic colors.
- [ ] Step 5: Refactor chat UI styles (`components/chat/*`) to use tokens (backgrounds, borders, accent, success/error if any).
- [ ] Step 6: Refactor auth pages (`app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`) to remove saturated gradients/shadows; use accent and warm neutrals; migrate error/success colors.
- [ ] Step 7: Optional: soften `GoogleButton` border/text styling to match theme (keep brand SVG fills).
- [ ] Step 8: Run grep-style search for remaining hard-coded saturated color classes/hex and migrate remaining.
- [ ] Step 9: Run `npm run lint` and `npm run build` to ensure functionality unchanged.

