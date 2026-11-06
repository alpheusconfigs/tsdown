import type {
    OutExtensionContext,
    OutExtensionObject,
    UserConfig,
} from "tsdown";

import type { Preset, PresetResult } from "#/@types/preset";

import { toMerged } from "es-toolkit";

type CompleteExtraOptionsCJS = {
    /**
     * Whether to use a fixed extension for the output files.
     *
     * If `true`, all output files will use the `.cjs` extension regardless
     * anything else.
     *
     * By default, it is `false`.
     */
    fixedExtension: boolean;
};

/**
 * Extra options for the CJS preset.
 */
type ExtraOptionsCJS = Partial<CompleteExtraOptionsCJS>;

/**
 * Config for the CommonJS preset.
 */
type PresetConfigCJS = UserConfig & {
    /**
     * Preset-specific options.
     */
    presetOptions?: ExtraOptionsCJS;
};

/**
 * CommonJS preset.
 *
 * This preset includes the default CommonJS options.
 */
const cjsPreset = (config?: PresetConfigCJS): Preset => {
    const { presetOptions, ...cfgRest } = config ?? {};

    return ({ config: internalConfig }): PresetResult => {
        const cfgBase: UserConfig = toMerged(internalConfig, {
            outExtensions: ({
                pkgType,
            }: OutExtensionContext): OutExtensionObject => {
                // Fixed extension
                if (presetOptions?.fixedExtension === true) {
                    return {
                        js: ".cjs",
                    };
                }

                // CJS file in ESM project
                if (pkgType === "module") {
                    return {
                        js: ".cjs",
                    };
                }

                // CJS file in CJS project
                return {
                    js: ".js",
                };
            },
        } satisfies UserConfig);

        const cfg: UserConfig = toMerged(cfgBase, cfgRest);

        return {
            config: {
                ...cfg,
                format: "cjs",
            },
        };
    };
};

export type { ExtraOptionsCJS, PresetConfigCJS };
export { cjsPreset };
