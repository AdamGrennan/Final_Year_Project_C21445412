/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			  PRIMARY: '#9747FF',
        SECONDARY: '#2B86E8',
        MERGE: '#735CF7',
        GRAAY: '#F2F2F2',
  		},
      fontFamily: {
        urbanist: ["Urbanist", "sans-serif"],
      },
  		borderRadius: {
  		
  		}
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
	require("@tailwindcss/forms"),
  ],
  
};
