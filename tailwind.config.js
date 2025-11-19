/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Next.js相关文件
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // 其他可能包含Tailwind类的文件
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 扩展默认主题
      colors: {
        // 可以添加自定义颜色
        primary: "#1DA1F2",
        secondary: "#657786",
        accent: "#17BF63",
        danger: "#E0245E",
        dark: "#14171A",
        light: "#F5F8FA",
      },
      fontFamily: {
        // 使用项目中已配置的字体
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      // 可以添加自定义动画
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
    },
  },
  darkMode: "media", // 支持深色模式，基于系统设置
  plugins: [require("tailwindcss-animate")],
};
