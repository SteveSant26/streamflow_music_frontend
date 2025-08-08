export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Colores del sistema de temas
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)', 
        background: 'var(--background-color)',
        surface: 'var(--surface-color)',
        'on-background': 'var(--on-background-color)',
        'on-surface': 'var(--on-surface-color)',
      }
    },
  },
  darkMode: 'class',
}
