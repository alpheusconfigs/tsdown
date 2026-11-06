set shell := ["bash", "-cu"]
set windows-shell := ["pwsh", "-Command"]

oxfmt := "pnpm exec oxfmt"
oxlint := "pnpm exec oxlint"
tsdown := "pnpm exec tsdown"
vitest := "pnpm exec vitest"

publish_dev := "pnpm publish --no-git-checks --tag dev --access public"
publish := "pnpm publish --access public"

pkg := "package"

test_cjs := "tests/cjs"
test_esm := "tests/esm"
test_dts := "tests/dts"
test_iife := "tests/iife"

example_cjs := "examples/cjs"
example_esm := "examples/esm"
example_iife := "examples/iife"

# Default action
_:
    just --list -u

# Install
i:
    pnpm install

# Format code
fmt:
    {{oxfmt}}

# Lint code with ls-lint
ls-lint:
    ls-lint -config ./.ls-lint.yaml

# Lint code with ls-lint
lslint: ls-lint

# Lint code with typos-cli
typos:
    typos

# Lint code with type check
lint:
    {{oxlint}} --fix --fix-suggestions --fix-dangerously

# Build package
build:
    cd ./{{pkg}} && ../node_modules/.bin/tsdown -c tsdown.config.ts

# Run tests
test:
    cd ./{{test_cjs}} && {{vitest}} run
    cd ./{{test_esm}} && {{vitest}} run
    cd ./{{test_dts}} && {{vitest}} run
    cd ./{{test_iife}} && {{vitest}} run

# Check code
check: build fmt ls-lint typos lint test

# Build CommonJS example
example-cjs:
    cd ./{{example_cjs}} && ./{{tsdown}} -c tsdown.config.ts

# Build ESModule example
example-esm:
    cd ./{{example_esm}} && ./{{tsdown}} -c tsdown.config.ts

# Build IIFE example
example-iife:
    cd ./{{example_iife}} && ./{{tsdown}} -c tsdown.config.ts

# Publish package with dev tag as dry-run
publish-dev-try:
    cd ./{{pkg}} && {{publish_dev}} --dry-run

# Publish package with dev tag
publish-dev:
    cd ./{{pkg}} && {{publish_dev}}

# Publish package as dry-run
publish-try:
    cd ./{{pkg}} && {{publish}} --dry-run

# Publish package
publish:
    cd ./{{pkg}} && {{publish}}

# Clean builds (Linux)
clean-linux:
    rm -rf ./{{pkg}}/dist

# Clean builds (macOS)
clean-macos: clean-linux

# Clean builds (Windows)
clean-windows:
    if (Test-Path "./{{pkg}}/dist") { Remove-Item -Recurse -Force "./{{pkg}}/dist" }

# Clean builds
clean:
    just clean-{{os()}}

# Clean everything (Linux)
clean-all-linux:
    just clean

    rm -rf ./{{test_iife}}/node_modules
    rm -rf ./{{test_dts}}/node_modules
    rm -rf ./{{test_esm}}/node_modules
    rm -rf ./{{test_cjs}}/node_modules

    rm -rf ./{{pkg}}/node_modules

    rm -rf ./node_modules

# Clean everything (macOS)
clean-all-macos:
    just clean-all-linux

# Clean everything (Windows)
clean-all-windows:
    just clean

    if (Test-Path "./{{test_iife}}/node_modules") { Remove-Item -Recurse -Force "./{{test_iife}}/node_modules" }
    if (Test-Path "./{{test_dts}}/node_modules") { Remove-Item -Recurse -Force "./{{test_dts}}/node_modules" }
    if (Test-Path "./{{test_esm}}/node_modules") { Remove-Item -Recurse -Force "./{{test_esm}}/node_modules" }
    if (Test-Path "./{{test_cjs}}/node_modules") { Remove-Item -Recurse -Force "./{{test_cjs}}/node_modules" }

    if (Test-Path "./{{pkg}}/node_modules") { Remove-Item -Recurse -Force "./{{pkg}}/node_modules" }

    if (Test-Path "./node_modules") { Remove-Item -Recurse -Force "./node_modules" }

# Clean everything
clean-all:
    just clean-all-{{os()}}
