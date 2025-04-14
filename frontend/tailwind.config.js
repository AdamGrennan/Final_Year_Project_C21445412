/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: ['text-emerald-500', 
             'text-sky-500'
  ],
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			  PRIMARY: '#F58F29',
        SECONDARY: '#F9C80E',
        MERGE: '#F7B801',
        GRAAY: '#F2F2F2',
  		},
      fontFamily: {
        urbanist: ["Urbanist", "sans-serif"],
      },
  		borderRadius: {
  		
  		},
      keyframes: {
        "fade-in": {
              "0%": {
                  opacity: 0
              },
              "100%": {
                  opacity: 1
              },
          },
          "fade-out": {
              "0%": {
                  opacity: 1
              },
              "100%": {
                  opacity: 0
              },
          },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      }
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
	require("@tailwindcss/forms"),
  require('tailwind-scrollbar'),
  ],
  
};
