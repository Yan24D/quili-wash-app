/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2563eb'; // Azul principal Quili Wash
const tintColorDark = '#5B8DEF';  // Azul más claro para modo oscuro

export const Colors = {
  light: {
    // Colores base del tema claro
    text: '#1f2937',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#ffffff',
    tabIconDefault: '#6b7280',
    tabIconSelected: tintColorLight,
    
    // Colores de la app
    primary: '#2563eb',           // Azul Quili Wash
    secondary: '#3b82f6',
    surface: '#f5f5f5',           // Gris muy claro
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    
    // Tarjetas de indicadores
    cardGreen: '#10b981',
    cardBlue: '#3b82f6',
    cardPurple: '#8b5cf6',
    cardRed: '#ef4444',
    cardTeal: '#14b8a6',
    cardOrange: '#f97316',
  },
  dark: {
    // Modo oscuro 
    text: '#E4E6EB',              // Texto principal 
    background: '#18191A',         // Fondo principal 
    tint: tintColorDark,
    icon: '#E4E6EB',
    tabIconDefault: '#B0B3B8',    // Gris claro 
    tabIconSelected: tintColorDark,
    
    // Colores de la app en modo oscuro
    primary: '#2563eb',           // Azul Quili Wash adaptado
    secondary: '#3b82f6',
    surface: '#242526',           // Fondo de tarjetas 
    textSecondary: '#B0B3B8',     // Texto secundario
    border: '#3A3B3C',            // Bordes sutiles
    error: '#F02849',
    success: '#2C9F67',
    warning: '#FF9500',
    
    // Tarjetas de indicadores (versiones oscuras)
    cardGreen: '#2C9F67',
    cardBlue: '#3b82f6',
    cardPurple: '#9B6CE8',
    cardRed: '#F02849',
    cardTeal: '#26B8A6',
    cardOrange: '#FF6B18',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
