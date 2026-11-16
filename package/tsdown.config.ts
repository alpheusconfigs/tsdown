import type { OutExtensionObject, UserConfig } from "tsdown";

import { defineConfig } from "tsdown";

const options: UserConfig = {
    entry: {
        index: "./src/index.ts",
        presets: "./src/presets.ts",
    },
    dts: false,
    outDir: "./dist",
    clean: true,
    platform: "node",
    treeshake: true,
    sourcemap: true,
    minify: false,
    shims: true,
    unbundle: false,
    hash: false,
    inputOptions: {
        experimental: {
            attachDebugInfo: "none",
        },
    },
};

export default defineConfig([
    {
        ...options,
        format: "esm",
        outExtensions: (): OutExtensionObject => ({
            js: ".mjs",
        }),
    },
    {
        ...options,
        format: "cjs",
        outExtensions: (): OutExtensionObject => ({
            js: ".js",
        }),
    },
    {
        ...options,
        dts: {
            dtsOnly: true,
        },
        outExtensions: (): OutExtensionObject => ({
            js: ".js",
            dts: ".ts",
        }),
    },
]);
