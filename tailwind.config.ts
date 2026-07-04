import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { surface:"#F7F8FA",ink:"#0D0F12",border:"#E2E5EA",muted:"#6B7280",accent:"#2563EB",success:"#16A34A",danger:"#DC2626",warning:"#D97706" }, fontFamily: { sans:["Inter","system-ui","sans-serif"], mono:["JetBrains Mono","monospace"] }, fontSize: { "2xs":["0.65rem",{"lineHeight":"1rem"}] } } },
  plugins: [],
};
export default config;