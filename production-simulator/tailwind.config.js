/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			animation: {
				'pulse-3': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 3',
			},
			keyframes: {
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '.5' },
				},
			},
		},
	},
	plugins: [],
}
