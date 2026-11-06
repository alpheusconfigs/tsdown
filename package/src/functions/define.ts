import type { UserConfig } from "tsdown";

import type { Preset, PresetResult } from "#/@types/preset";

import { toMerged } from "es-toolkit";

import { OPTIONS_DEFAULT } from "#/constants";

const processPresetResults = (presetResults: PresetResult[]): UserConfig[] => {
    const result: UserConfig[] = [];

    for (const presetResult of presetResults) {
        // undefined
        if (!presetResult.config) continue;

        // array
        if (Array.isArray(presetResult.config)) {
            for (const opts of presetResult.config) {
                result.push(opts);
            }
        }

        // object
        else {
            result.push(presetResult.config);
        }
    }

    return result;
};

const defineConfigFn = (
    userConfig?: UserConfig,
    presets?: Preset[],
): UserConfig[] => {
    const config: UserConfig = toMerged(OPTIONS_DEFAULT, userConfig ?? {});

    if (!presets) {
        return [config];
    }

    const presetResults: PresetResult[] = [];

    for (const preset of presets) {
        const presetResult: PresetResult = preset({
            config,
        });

        presetResults.push(presetResult);
    }

    return processPresetResults(presetResults);
};

/**
 * Define tsdown configuration.
 *
 * ### Example
 *
 * ```ts
 * import type { UserConfig } from "tsdown";
 *
 * import { defineConfig } from "@apst/tsdown";
 * import {
 *     esmPreset,
 *     cjsPreset,
 *     dtsPreset,
 *     iifePreset,
 * } from "@apst/tsdown/presets";
 *
 * const options: UserConfig = {
 *     entry: {
 *         index: "./src/index.ts",
 *     },
 * };
 *
 * const iifeOptions: UserConfig = {
 *     entry: {
 *         init: "./src/init.ts",
 *     },
 * };
 *
 * export default defineConfig([
 *     esmPreset(options),
 *     cjsPreset(options),
 *     dtsPreset(options),
 *     iifePreset(iifeOptions),
 * ]);
 * ```
 */
function defineConfig(presets?: Preset[]): UserConfig[];

/**
 * Define tsdown configuration.
 *
 * ### Example
 *
 * ```ts
 * import { defineConfig } from "@apst/tsdown";
 * import { esmPreset, cjsPreset, dtsPreset } from "@apst/tsdown/presets";
 *
 * export default defineConfig(
 *     {
 *         entry: {
 *             index: "./src/index.ts",
 *         },
 *     },
 *     [esmPreset(), cjsPreset(), dtsPreset()],
 * );
 * ```
 */
function defineConfig(config?: UserConfig, presets?: Preset[]): UserConfig[];

function defineConfig(
    presetsOrConfig?: Preset[] | UserConfig,
    optionalPresets?: Preset[],
): UserConfig[] {
    try {
        const config: UserConfig | undefined = Array.isArray(presetsOrConfig)
            ? void 0
            : presetsOrConfig;

        const presets: Preset[] | undefined = Array.isArray(presetsOrConfig)
            ? presetsOrConfig
            : optionalPresets;

        return defineConfigFn(config, presets);
    } catch (err: unknown) {
        console.error(err);
        throw err;
    }
}

export { defineConfig };
