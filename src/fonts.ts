export type FontOption = { label: string; value: string };

export const SANS_FONTS: FontOption[] = [
  { label: 'Inter', value: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
  { label: 'Roboto', value: "'Roboto', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Lato', value: "'Lato', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Noto Sans', value: "'Noto Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Source Sans Pro', value: "'Source Sans Pro', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Work Sans', value: "'Work Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'IBM Plex Sans', value: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Fira Sans', value: "'Fira Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Nunito', value: "'Nunito', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
  { label: 'PT Sans', value: "'PT Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" },
];

export const SERIF_FONTS: FontOption[] = [
  { label: 'Merriweather', value: "'Merriweather', Georgia, 'Times New Roman', Times, serif" },
  { label: 'Noto Serif', value: "'Noto Serif', Georgia, 'Times New Roman', Times, serif" },
  { label: 'PT Serif', value: "'PT Serif', Georgia, 'Times New Roman', Times, serif" },
  { label: 'Spectral', value: "'Spectral', Georgia, 'Times New Roman', Times, serif" },
  { label: 'Libre Baskerville', value: "'Libre Baskerville', Georgia, 'Times New Roman', Times, serif" },
  { label: 'Georgia (system)', value: "Georgia, 'Times New Roman', Times, serif" },
];

export const MONO_FONTS: FontOption[] = [
  { label: 'Roboto Mono', value: "'Roboto Mono', Menlo, Monaco, 'Courier New', monospace" },
  { label: 'Source Code Pro', value: "'Source Code Pro', Menlo, Monaco, 'Courier New', monospace" },
];

export const ALL_FONT_COUNT = SANS_FONTS.length + SERIF_FONTS.length + MONO_FONTS.length;
