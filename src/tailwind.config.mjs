/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '600' }],
                xl: ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.03em', fontWeight: '700' }],
                '2xl': ['2rem', { lineHeight: '1.3', letterSpacing: '0.03em', fontWeight: '700' }],
                '3xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.035em', fontWeight: '800' }],
                '4xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.04em', fontWeight: '800' }],
                '5xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.04em', fontWeight: '900' }],
                '6xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '0.045em', fontWeight: '900' }],
                '7xl': ['6rem', { lineHeight: '1.05', letterSpacing: '0.05em', fontWeight: '900' }],
                '8xl': ['8rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
                '9xl': ['9.5rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "avenir-lt-w01_85-heavy1475544",
                paragraph: "avenir-lt-w01_35-light1475496"
            },
            colors: {
                lavenderspot: '#9B8FB7',
                cream: '#FFF9F0',
                black: '#000000',
                foreground: '#000000',
                destructive: '#DF3131',
                destructiveforeground: '#ffffff',
                background: '#FAD9C1',
                secondary: '#8B8B2F',
                'secondary-foreground': '#000000',
                'primary-foreground': '#FFF9F0',
                primary: '#D35B3F'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
