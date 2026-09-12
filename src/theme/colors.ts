export const THEME = {
  background: '#f2f0ea',
  primaryTextWireframe: '#1A2A3A',
  accentCTA: '#A83226',
} as const;

export const FONTS = {
  primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  logo: "'Cormorant Garamond', serif",
  heroTitle: "'Syne', sans-serif",
} as const;

export type ThemeColors = typeof THEME;
export type ThemeFonts = typeof FONTS;

