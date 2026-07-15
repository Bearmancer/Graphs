# Graphs Repo Modernization Assessment

## Book Abstraction
Current `Graphs` repo hardcodes structure. Need `IBook` abstraction.
Interface `IBook`:
- `Title` (string)
- `Chapters` (array)
- `GraphData` (nodes, edges)

Implement standard interface. Load JSON/YAML configs. Render dynamic Vite components.

## Stack Modernization (TS 7 & Go)
TypeScript 7 rewrite `tsc` in Go. 10x faster build.
- **Vite + React:** Keep. Fast HMR.
- **TypeScript 7:** Upgrade `devDependencies`. Use new Go-based `tsc`.
- **Performance:** Instant project load. Fixes bloat. No need custom Go backend, TS 7 *is* Go-powered.

## Next Steps
1. Update `package.json` to `typescript@7.0`.
2. Refactor Vite config to use Go-compiler if needed (TS 7 native).
3. Create `src/core/IBook.ts`.
4. Migrate hardcoded data to JSON files.
