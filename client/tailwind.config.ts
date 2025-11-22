import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'scp-black': '#050505',
                'scp-green': '#00ff41',
                'scp-green-dim': '#008F11',
                'scp-red': '#ff3333',
                'scp-border': '#333333',
            },
            fontFamily: {
                mono: ['var(--font-share-tech-mono)', 'monospace'],
            },
        },
    },
    plugins: [],
};
export default config;
