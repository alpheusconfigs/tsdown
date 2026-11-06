import type { OutExtensionObject, UserConfig } from "tsdown";

import type { Preset, PresetResult } from "#/@types/preset";

import { toMerged } from "es-toolkit";

type CompleteExtraOptionsDTS = {
    /**
     * Whether optimize for the performance.
     *
     * This option may cause error sometimes.
     *
     * By default, it is `false`.
     */
    performanceMode: boolean;
};

/**
 * Extra options for the DTS preset.
 */
type ExtraOptionsDTS = Partial<CompleteExtraOptionsDTS>;

/**
 * Config for the DTS preset.
 */
type PresetConfigDTS = UserConfig & {
    /**
     * Preset-specific options.
     */
    presetOptions?: ExtraOptionsDTS;
};

/**
 * DTS preset.
 *
 * This preset includes the default DTS options.
 */
const dtsPreset = (config?: PresetConfigDTS): Preset => {
    const { presetOptions, ...configRest } = config ?? {};

    return ({ config: internalConfig }): PresetResult => {
        const optsPreset: UserConfig = {
            dts: {
                emitDtsOnly: true,
                // whether enable oxc-transform
                compilerOptions:
                    presetOptions?.performanceMode === true
                        ? {
                              isolatedDeclarations: true,
                          }
                        : {},
            },
            // always output .d.ts
            outExtensions: (): OutExtensionObject => {
                return {
                    dts: ".ts",
                };
            },
        };

        const optsBase: UserConfig = toMerged(internalConfig, optsPreset);

        const cfg: UserConfig = toMerged(optsBase, configRest);

        return {
            config: cfg,
        };
    };
};

export type { ExtraOptionsDTS, PresetConfigDTS };
export { dtsPreset };
