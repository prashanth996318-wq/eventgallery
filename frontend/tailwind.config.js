/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FirstCry Intellitots branding theme (warm yellow and vibrant blue/pink)
        brand: {
          yellow: '#FFC72C',
          orange: '#FF7A00',
          blue: '#00A8E8',
          pink: '#FF4081',
          navy: '#1A237E',
          charcoal: '#2D3748',
          lightBg: '#F7FAFC',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
