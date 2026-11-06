import type { UserConfig } from "tsdown";

import Fs from "node:fs";
import Path from "node:path";

import { defineConfig } from "@apst/tsdown";
import { cjsPreset } from "@apst/tsdown/presets";
import { build } from "tsdown";
import { beforeAll, describe, expect, it } from "vitest";

const CWD: string = process.cwd();

const PATH_DIST: string = Path.join(CWD, "dist");

const PATH_INDEX: string = Path.join(PATH_DIST, "index.js");

beforeAll(async (): Promise<void> => {
    const configs: UserConfig[] = defineConfig(
        {
            entry: {
                index: "./src/index.ts",
            },
        },
        [cjsPreset()],
    );

    for (const config of configs) {
        await build(config);
    }
});

describe("CommonJS tests", (): void => {
    it("should work", (): void => {
        expect(Fs.existsSync(PATH_DIST)).toBe(true);
        expect(Fs.existsSync(PATH_INDEX)).toBe(true);
        expect(Fs.existsSync(`${PATH_INDEX}.map`)).toBe(true);
    });
});
