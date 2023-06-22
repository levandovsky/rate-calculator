import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "./plugins/svgr";

export default defineConfig({
  plugins: [react(), svgr()],
})
