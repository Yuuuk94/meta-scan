Empty on purpose — reserved for client-component (`"use client"`) data-fetching/state hooks
wrapping React Query (`useQuery`/`useMutation`), per ADR-010 (`docs/frontend-atomic-architecture.md`).

React Query isn't installed yet (`@tanstack/react-query` isn't a dependency) and no
`QueryClientProvider` exists — installing it and wiring it up is follow-up work, out of scope for
this migration pass. Server components (`app/[lang]/**/page.tsx`) can't use hooks at all and
should keep calling `@/api/*` directly, not go through this folder.
