import { defineConfig } from "vitest/config";
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
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/testSetup.ts"],
  },
});
