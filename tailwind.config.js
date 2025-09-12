    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {
          // Here is where we define our custom "global variables"
          colors: {
            'brand-background': '#1F1E1E',
            'brand-primary': '#C1CFFB',      // Soft Blue
            'brand-accent': '#A78BFA',       // Vibrant Violet
            'brand-success': '#6EE7B7',      // Rewarding Teal
            'brand-text': '#E5E7EB',         // Off-White
            'brand-text-muted': '#9CA3AF',   // Gray
          },
          fontFamily: {
            // We can also set a default font here
            sans: ['Inter', 'sans-serif'],
          }
        },
      },
      plugins: [],
    }
    
