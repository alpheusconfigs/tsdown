# tsdown Configuration

A shareable tsdown configuration.

## Installation

Install these packages as a dev dependencies in the project:

```sh
# npm
npm i -D tsdown @apst/tsdown

# Yarn
yarn add -D tsdown @apst/tsdown

# pnpm
pnpm add -D tsdown @apst/tsdown

# Bun
bun add -D tsdown @apst/tsdown
```

## Usage

Implement the preset into `tsdown.config.ts`:

```ts
import { defineConfig } from "@apst/tsdown";
import { cjsPreset, esmPreset, dtsPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            index: "./src/index.ts",
        },
    },
    [cjsPreset(), esmPreset(), dtsPreset()],
);
```

With IIFE output:

```ts
import type { UserConfig } from "tsdown";

import { defineConfig } from "@apst/tsdown";
import {
    cjsPreset,
    esmPreset,
    dtsPreset,
    iifePreset,
} from "@apst/tsdown/presets";

const config: UserConfig = {
    entry: {
        index: "./src/index.ts",
    },
};

const iifeConfig: UserConfig = {
    entry: {
        init: "./src/init.ts",
    },
    deps: {
        alwaysBundle: [
            // ...
        ],
    },
};

export default defineConfig([
    cjsPreset(config),
    esmPreset(config),
    dtsPreset(config),
    iifePreset(iifeConfig),
]);
```

## License

This project is licensed under the terms of the MIT license.
