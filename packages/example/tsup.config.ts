import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  sourcemap: true,
  dts: true,
  clean: true
});
