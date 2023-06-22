import { transform } from "@svgr/core";
import { Plugin, transformWithEsbuild } from "vite";
import fs from "fs/promises";
const svgrPlugin = (): Plugin => ({
  name: "svgr",
  enforce: "pre",
  async transform(code, id) {
    if (!id.endsWith(".svg")) return;

    const svgCode = await fs.readFile(id, "utf-8");
    const jsxCode = await transform(
      svgCode,
      {
        plugins: ["@svgr/plugin-jsx"],
        typescript: true,
      },
      {
        componentName: "ReactComponent",
      }
    );
    const result = await transformWithEsbuild(jsxCode, id, {
      loader: "tsx",
    });

    return {
      code: result.code,
      map: null,
    }
  },
});
export default svgrPlugin;
