/// <reference types="vite/client" />

declare module 'd3-force-3d' {
  export function forceCollide(radius?: number | ((node: unknown) => number)): unknown;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
