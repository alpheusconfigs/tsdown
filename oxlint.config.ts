import { defineConfig } from "@apst/oxlint";
import { commonPreset } from "@apst/oxlint/presets/common";
import { nodePreset } from "@apst/oxlint/presets/node";
import { vitestPreset } from "@apst/oxlint/presets/vitest";

export default defineConfig(
    {
        options: {
            typeAware: true,
            typeCheck: true,
        },
    },
    [commonPreset(), nodePreset(), vitestPreset()],
);
