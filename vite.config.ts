import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import svgr from "./plugins/svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
