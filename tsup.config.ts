import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["./lib/lrc.ts"],
    globalName: "Lrc",
    format: ["esm", "cjs", "iife"],
    dts: true,
    outDir: "dist",
});