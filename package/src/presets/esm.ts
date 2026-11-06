import type {
    OutExtensionContext,
    OutExtensionObject,
    UserConfig,
} from "tsdown";

import type { Preset, PresetResult } from "#/@types/preset";

import { toMerged } from "es-toolkit";

type CompleteExtraOptionsESM = {
    /**
     * Whether to use a fixed extension for the output files.
     *
     * If `true`, all output files will use the `.mjs` extension regardless
     * anything else.
     *
     * By default, it is `false`.
     */
    fixedExtension: boolean;
};

/**
 * Extra options for the ESM preset.
 */
type ExtraOptionsESM = Partial<CompleteExtraOptionsESM>;

/**
 * Config for the ESModule preset.
 */
type PresetConfigESM = UserConfig & {
    /**
     * Preset-specific options.
     */
    presetOptions?: ExtraOptionsESM;
};

/**
 * ESModule preset.
 *
 * This preset includes the default ESModule config.
 */
const esmPreset = (config?: PresetConfigESM): Preset => {
    const { presetOptions, ...configRest } = config ?? {};

    return ({ config: internalConfig }): PresetResult => {
        const cfgBase: UserConfig = toMerged(internalConfig, {
            outExtensions: ({
                pkgType,
            }: OutExtensionContext): OutExtensionObject => {
                // Fixed extension
                if (presetOptions?.fixedExtension === true) {
                    return {
                        js: ".mjs",
                    };
                }

                // ESM file in ESM project
                if (pkgType === "module") {
                    return {
                        js: ".js",
                    };
                }

                // ESM file in ESM project
                return {
                    js: ".mjs",
                };
            },
        } satisfies UserConfig);

        const cfg: UserConfig = toMerged(cfgBase, configRest);

        return {
            config: {
                ...cfg,
                format: "esm",
            },
        };
    };
};

export type { ExtraOptionsESM, PresetConfigESM };
export { esmPreset };
