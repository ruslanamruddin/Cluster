
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                // Custom colors for our app
                tech: {
                    dark: '#050A12',
                    navy: '#0A0E17',
                    accent1: '#00FFFF', // cyan
                    accent2: '#8A2BE2', // purple
                    accent3: '#FF00FF', // magenta
                    glow1: 'rgba(0, 255, 255, 0.6)',
                    glow2: 'rgba(138, 43, 226, 0.6)',
                    glow3: 'rgba(255, 0, 255, 0.6)',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    medium: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(0, 0, 0, 0.2)',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.8', filter: 'blur(10px)' },
                    '50%': { opacity: '1', filter: 'blur(15px)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fade-in 0.6s ease-out forwards',
                'slide-up': 'slide-up 0.8s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
                'scale-in': 'scale-in 0.5s ease-out forwards',
                'gradient-shift': 'gradient-shift 15s ease infinite',
			},
            backgroundImage: {
                'tech-grid': 'radial-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                'tech-gradient': 'linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(138, 43, 226, 0.2))',
                'cta-gradient': 'linear-gradient(90deg, #00FFFF, #8A2BE2, #FF00FF)',
            },
            boxShadow: {
                'neon-cyan': '0 0 5px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
                'neon-purple': '0 0 5px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
                'neon-glow': '0 0 15px rgba(255, 255, 255, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
            },
            backdropFilter: {
                'glass': 'blur(16px) saturate(180%)',
            },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
