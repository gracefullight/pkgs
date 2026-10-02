# create-fullstack-starter

## [0.2.7](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.6...create-fullstack-starter@0.2.7) (2026-10-02)


### Features

* add create-fullstack-starter CLI package ([94f462c](https://github.com/gracefullight/pkgs/commit/94f462c7acf4de3077ad65f73bcf7472497bf2be))
* add GitHub Sponsors funding link to npm packages ([c68dfee](https://github.com/gracefullight/pkgs/commit/c68dfeebe02e4b3e2cc2aaaaec525b8037edb6d1))
* **create-fullstack-starter:** add interactive GitHub star prompt with y as default ([ff39460](https://github.com/gracefullight/pkgs/commit/ff39460aeb29a3fbf4dd98aee70ca3373abc35dd))
* **create-fullstack-starter:** enhance GitHub star prompt with gh CLI install/auth flow ([007e6b9](https://github.com/gracefullight/pkgs/commit/007e6b9836eccbacf8324bae707696465f76ad1c))


### Bug Fixes

* apply consistent code formatting and update various package configurations and tools across the monorepo ([7783641](https://github.com/gracefullight/pkgs/commit/7783641e0b3a8c9de191441c4f05bb3070af4e69))
* **create-fullstack-starter:** add vitest as package devDependency for CI ([d931ebd](https://github.com/gracefullight/pkgs/commit/d931ebdb8f37f4a8988cab5d46d637f67ce792fa))
* **create-fullstack-starter:** pass clone paths as arguments ([e32f425](https://github.com/gracefullight/pkgs/commit/e32f425e0a183d6d62aafe0f8e3ed6dd78d0d8b4))
* **create-fullstack-starter:** prevent tiged from deleting directories with .git ([9a7f5f8](https://github.com/gracefullight/pkgs/commit/9a7f5f8a2d3631a36cc404e86e79f26da5fe5c9a))
* resolve TS6 build errors across packages ([3644648](https://github.com/gracefullight/pkgs/commit/36446487995299b19ca4b20b7022fda3be514fe2))

## 0.2.6 (2026-10-03)

- Clone destinations using command arguments to preserve spaces and prevent shell injection.
- Reject file targets and allow importing the CLI without parsing arguments.
- Update dependencies to current compatible stable versions.

## [0.2.5](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.4...create-fullstack-starter@0.2.5) (2026-04-02)


### Bug Fixes

* **create-fullstack-starter:** add vitest as package devDependency for CI ([d931ebd](https://github.com/gracefullight/pkgs/commit/d931ebdb8f37f4a8988cab5d46d637f67ce792fa))
* **create-fullstack-starter:** prevent tiged from deleting directories with .git ([9a7f5f8](https://github.com/gracefullight/pkgs/commit/9a7f5f8a2d3631a36cc404e86e79f26da5fe5c9a))

## [0.2.4](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.3...create-fullstack-starter@0.2.4) (2026-03-25)


### Features

* **create-fullstack-starter:** enhance GitHub star prompt with gh CLI install/auth flow ([007e6b9](https://github.com/gracefullight/pkgs/commit/007e6b9836eccbacf8324bae707696465f76ad1c))


### Bug Fixes

* resolve TS6 build errors across packages ([3644648](https://github.com/gracefullight/pkgs/commit/36446487995299b19ca4b20b7022fda3be514fe2))

## [0.2.3](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.2...create-fullstack-starter@0.2.3) (2026-03-09)


### Features

* **create-fullstack-starter:** add interactive GitHub star prompt with y as default ([ff39460](https://github.com/gracefullight/pkgs/commit/ff39460aeb29a3fbf4dd98aee70ca3373abc35dd))

## [0.2.2](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.1...create-fullstack-starter@0.2.2) (2026-01-22)


### Bug Fixes

* apply consistent code formatting and update various package configurations and tools across the monorepo ([7783641](https://github.com/gracefullight/pkgs/commit/7783641e0b3a8c9de191441c4f05bb3070af4e69))

## [0.2.1](https://github.com/gracefullight/pkgs/compare/create-fullstack-starter@0.2.0...create-fullstack-starter@0.2.1) (2026-01-14)


### Features

* add GitHub Sponsors funding link to npm packages ([c68dfee](https://github.com/gracefullight/pkgs/commit/c68dfeebe02e4b3e2cc2aaaaec525b8037edb6d1))

## 0.2.0

### Minor Changes

- 5723cb1: Replace @inquirer/prompts with @clack/prompts for a more beautiful CLI experience

  - Add intro/outro for session start/end messages
  - Add spinner animation during template cloning
  - Display next steps in a styled note box
  - Improve cancellation handling with isCancel guard
