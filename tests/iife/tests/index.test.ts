import type { UserConfig } from "tsdown";

import Fs from "node:fs";
import Fsp from "node:fs/promises";
import Path from "node:path";

import { defineConfig } from "@apst/tsdown";
import { iifePreset } from "@apst/tsdown/presets";
import { build } from "tsdown";
import { beforeAll, describe, expect, it } from "vitest";

const CWD: string = process.cwd();

const PATH_DIST: string = Path.join(CWD, "dist");

const PATH_INDEX_DEV: string = Path.join(PATH_DIST, "init.development.js");
const PATH_INDEX_PRD: string = Path.join(PATH_DIST, "init.production.js");
const PATH_INDEX_PRD_MIN: string = Path.join(
    PATH_DIST,
    "init.production.min.js",
);

beforeAll(async (): Promise<void> => {
    if (Fs.existsSync(PATH_DIST))
        await Fsp.rm(PATH_DIST, {
            recursive: true,
            force: true,
        });

    const iifeDevOptions: UserConfig = {
        entry: {
            "init.development": "./src/init.ts",
        },
    };

    const iifePrdOptions: UserConfig = {
        entry: {
            "init.production": "./src/init.ts",
        },
    };

    const iifePrdMinOptions: UserConfig = {
        entry: {
            "init.production.min": "./src/init.ts",
        },
        minify: true,
    };

    const configs: UserConfig[] = defineConfig(
        {
            clean: false,
        },
        [
            iifePreset(iifeDevOptions),
            iifePreset(iifePrdOptions),
            iifePreset(iifePrdMinOptions),
        ],
    );

    for (const config of configs) {
        await build(config);
    }
});

describe("IIFE tests", (): void => {
    it("should have dist", (): void => {
        expect(Fs.existsSync(PATH_DIST)).toBe(true);
    });

    it("should work in development", (): void => {
        expect(Fs.existsSync(PATH_INDEX_DEV)).toBe(true);
    });

    it("should work in production", (): void => {
        expect(Fs.existsSync(PATH_INDEX_PRD)).toBe(true);
    });

    it("should work in production and minify", (): void => {
        expect(Fs.existsSync(PATH_INDEX_PRD_MIN)).toBe(true);
    });
});
