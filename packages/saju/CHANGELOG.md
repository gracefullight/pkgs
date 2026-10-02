# @gracefullight/saju

## [2.0.0](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.3.2...@gracefullight/saju@2.0.0) (2026-10-02)


### ⚠ BREAKING CHANGES

* **saju:** All public API functions now take datetime as the first argument and adapter as part of the options object.
* **saju:** remove deprecated APIs and add alternativeBalance to YongShen
* **saju:** STANDARD_PRESET now applies longitude-based solar time correction for hour pillar calculation by default (useMeanSolarTimeForHour: true). This matches the behavior of popular Korean fortune-telling services like 포스텔러.

### Features

* add GitHub Sponsors funding link to npm packages ([c68dfee](https://github.com/gracefullight/pkgs/commit/c68dfeebe02e4b3e2cc2aaaaec525b8037edb6d1))
* **example:** add Next.js 15 demo app with GitHub Pages deployment ([f782b9b](https://github.com/gracefullight/pkgs/commit/f782b9b62596687de1295246b85245517f0db8a4))
* saju calculator with lunar-javascript integration ([b882131](https://github.com/gracefullight/pkgs/commit/b882131b91bda76bc91a2509a0654a211f58a64d))
* **saju,saju-dart:** add sinsals, nayin, solar term monthly luck, and parity fixes ([fe6922c](https://github.com/gracefullight/pkgs/commit/fe6922cf05bf2b55d4c4b19ffe0d1d3f21b3046b))
* **saju:** add comprehensive saju analysis features ([27642dd](https://github.com/gracefullight/pkgs/commit/27642dd6711eebeb168548bc41cfd929d3467b03))
* **saju:** add getTenGodForStem function ([ba68298](https://github.com/gracefullight/pkgs/commit/ba68298700f94199a453be820b45d49bb4941086))
* **saju:** add solar terms and update getSaju() API ([0598bfb](https://github.com/gracefullight/pkgs/commit/0598bfb0d4bb01d7905321a834b1695499523f78))
* **saju:** add twelve stages, sinsals, monthly/daily luck and refactor to types/utils ([07639f5](https://github.com/gracefullight/pkgs/commit/07639f51288ebf89b5dd3d9911a37725e6e50918))
* **saju:** enable mean solar time correction by default in STANDARD_PRESET ([a887261](https://github.com/gracefullight/pkgs/commit/a88726130f008f483756b19d73c2411f9ad98e67))
* **saju:** implement Gongmang, Wonjin and activate other Sinsals ([78264c2](https://github.com/gracefullight/pkgs/commit/78264c24be2df38a3715107efcb2361b2a87d404))
* **saju:** introduce Label objects across all analysis modules ([06c5dfc](https://github.com/gracefullight/pkgs/commit/06c5dfcb76ac55e5f602b3e28e5df82b486acfde))
* **saju:** make longitudeDeg and preset optional in getFourPillars and getSaju ([eb45156](https://github.com/gracefullight/pkgs/commit/eb4515605d5c43f9fb461255747f70775c9fdf65))
* **saju:** move adapter from first argument to options object ([cae129e](https://github.com/gracefullight/pkgs/commit/cae129ef37eec451240e83e5345684f7fe8a8245))
* **saju:** remove deprecated APIs and add alternativeBalance to YongShen ([b0b1c09](https://github.com/gracefullight/pkgs/commit/b0b1c09c363334214c3e0e779333cc493df71c33))


### Bug Fixes

* add publishConfig for scoped packages ([579250d](https://github.com/gracefullight/pkgs/commit/579250d9ffc103d474f6c5aac8c4c8ef6e32e2f8))
* apply consistent code formatting and update various package configurations and tools across the monorepo ([7783641](https://github.com/gracefullight/pkgs/commit/7783641e0b3a8c9de191441c4f05bb3070af4e69))
* resolve 9 lint issues including auto-fixable code style and type safety ([b21a32c](https://github.com/gracefullight/pkgs/commit/b21a32c0dc0455393f88ac159e9a2d41f0c6b959))
* **saju:** add currentYear to test for deterministic yearly luck range ([442f1d8](https://github.com/gracefullight/pkgs/commit/442f1d8cdd3eb29bb8b7df66d45bbd1ffa05a4e4))
* **saju:** apply expert fortune teller review feedback ([860fbc0](https://github.com/gracefullight/pkgs/commit/860fbc0740d1c79e9b2f91ddf884518039a318ad))
* **saju:** correct timezone and day boundary calculations ([b4584c5](https://github.com/gracefullight/pkgs/commit/b4584c5527d92444235d0fb5dc7b3f505e3b3634))
* **saju:** hour pillar calculation regression ([7f72fe7](https://github.com/gracefullight/pkgs/commit/7f72fe71e502e6a1643f2c74b23656e94d6aee54))
* **saju:** revert version to 0.4.2 for changeset workflow ([71e5732](https://github.com/gracefullight/pkgs/commit/71e5732221785cea5b36bed7393ee37f52a9c4f8))
* **saju:** support plain Date in date-fns adapter ([f802017](https://github.com/gracefullight/pkgs/commit/f8020174659f26f373b7024b436ae868aa700c9b))

## 1.3.2 (2026-10-03)

- Correct timezone conversion and historic Korean daylight saving boundaries.
- Accept every supported pillar preset through the public API.
- Update dependencies to current compatible stable versions.

## [1.3.1](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.3.0...@gracefullight/saju@1.3.1) (2026-04-10)


### Bug Fixes

* **saju:** support plain Date in date-fns adapter ([f802017](https://github.com/gracefullight/pkgs/commit/f8020174659f26f373b7024b436ae868aa700c9b))

## [1.3.0](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.2.0...@gracefullight/saju@1.3.0) (2026-02-21)


### Features

* **saju,saju-dart:** add sinsals, nayin, solar term monthly luck, and parity fixes ([fe6922c](https://github.com/gracefullight/pkgs/commit/fe6922cf05bf2b55d4c4b19ffe0d1d3f21b3046b))

## [1.2.0](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.1.3...@gracefullight/saju@1.2.0) (2026-02-01)


### Features

* **saju:** add getTenGodForStem function ([ba68298](https://github.com/gracefullight/pkgs/commit/ba68298700f94199a453be820b45d49bb4941086))

## [1.1.3](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.1.2...@gracefullight/saju@1.1.3) (2026-01-22)


### Bug Fixes

* resolve 9 lint issues including auto-fixable code style and type safety ([b21a32c](https://github.com/gracefullight/pkgs/commit/b21a32c0dc0455393f88ac159e9a2d41f0c6b959))

## [1.1.2](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.1.1...@gracefullight/saju@1.1.2) (2026-01-22)


### Bug Fixes

* apply consistent code formatting and update various package configurations and tools across the monorepo ([7783641](https://github.com/gracefullight/pkgs/commit/7783641e0b3a8c9de191441c4f05bb3070af4e69))

## [1.1.1](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.1.0...@gracefullight/saju@1.1.1) (2026-01-21)


### Bug Fixes

* **saju:** hour pillar calculation regression ([7f72fe7](https://github.com/gracefullight/pkgs/commit/7f72fe71e502e6a1643f2c74b23656e94d6aee54))

## [1.1.0](https://github.com/gracefullight/pkgs/compare/@gracefullight/saju@1.0.1...@gracefullight/saju@1.1.0) (2026-01-14)


### Features

* add GitHub Sponsors funding link to npm packages ([c68dfee](https://github.com/gracefullight/pkgs/commit/c68dfeebe02e4b3e2cc2aaaaec525b8037edb6d1))

## 1.0.1

### Patch Changes

- f92a4ad: chore: rename repository from workspace to pkgs

## 1.0.0

### Major Changes

- c849df2: Move adapter from first argument to options object

  BREAKING CHANGE: All public API functions now take datetime as the first argument and adapter as part of the options object.

  Before: `getSaju(adapter, datetime, options)`
  After: `getSaju(datetime, { adapter, ...options })`

  Affected functions:

  - getSaju, getFourPillars
  - yearPillar, monthPillar, hourPillar, effectiveDayDate
  - analyzeSolarTerms, getSolarTermsForYear
  - calculateMajorLuck

## 0.7.0

### Minor Changes

- 78264c2: feat: add Gongmang, Wonjin and activate Mangshin, Geopsal, Jaesal, Hongran, Cheonhui, Jangseong, Banan sinsals

## 0.6.0

### Minor Changes

- b0b1c09: Remove deprecated APIs and add alternativeBalance to YongShen

  BREAKING CHANGES:

  - Removed deprecated types: `TenGod`, `TwelveStage`, `Sinsal`, `YongShenMethod`, `StrengthLevel`, `TransformationStatus`
  - Removed deprecated constants: `TEN_GODS`, `TEN_GOD_HANJA`, `TEN_GOD_ENGLISH`, `STRENGTH_LEVELS`, `STAGE_INFO`
  - Removed deprecated functions: `getTenGod`, `getTwelveStage`

  Migration guide:

  - `TenGod` → `TenGodKey`
  - `TwelveStage` → `TwelveStageKey`
  - `Sinsal` → `SinsalKey`
  - `YongShenMethod` → `YongShenMethodKey`
  - `StrengthLevel` → `StrengthLevelKey`
  - `TransformationStatus` → `TransformationStatusKey`
  - `getTenGod(a, b)` → `getTenGodLabel(getTenGodKey(a, b))`
  - `getTwelveStage()` → `analyzeTwelveStages()`
  - `STAGE_INFO[key]` → `getTwelveStageLabel(key)`
  - `STRENGTH_LEVELS` → `STRENGTH_LEVEL_KEYS`

  New features:

  - Added `alternativeBalance` to `YongShenResult` for formation (종격) cases
  - Exported `getTenGodKey` function for direct ten god key calculation

  Bug fixes:

  - Fixed major luck start age rounding
  - Fixed yongshen calculation for strong day masters (CONTROLS → CONTROLLED_BY)

## 0.5.0

### Minor Changes

- 06c5dfc: Introduce Label objects across all analysis modules

  - TwelveStages, TenGods, Strength, YongShen, SolarTerms, Relations, and Sinsals modules now return Label objects containing hanja (Chinese characters), korean (Korean text), and meaning (description)
  - Replace plain string return values with structured Label objects for better i18n and detailed display support
  - Improve example app UI to display hanja + korean + meaning across all analysis sections

## 0.4.2

### Patch Changes

- 3f1e5c1: Test release pipeline with GH_TOKEN

## 0.4.0

### Minor Changes

- **BREAKING**: Enable mean solar time correction by default in STANDARD_PRESET
  - `useMeanSolarTimeForHour` is now `true` by default
  - This matches the behavior of popular Korean fortune-telling services like 포스텔러
  - If you need the old behavior, create a custom preset with `useMeanSolarTimeForHour: false`

## 0.3.0

### Minor Changes

- Add comprehensive saju analysis features
  - Ten Gods (십신) analysis with hidden stems
  - Strength (신강약) assessment with 9 levels
  - Relations (합충형파해) analysis
  - Major/Yearly Luck (대운/세운) calculation
  - Yongshen (용신) extraction with recommendations
  - Solar Terms (절기) analysis

## 0.2.0

### Minor Changes

- Add lunar calendar conversion functions
  - `getLunarDate()` - Convert solar to lunar date
  - `getSolarDate()` - Convert lunar to solar date
- Improve four pillars calculation accuracy

## 0.1.1

### Patch Changes

- Fix date adapter type exports
- Improve TypeScript definitions

## 0.1.0

### Minor Changes

- Initial release of @gracefullight/saju
  - Implement four pillars calculation (year, month, day, hour)
  - Add date adapter pattern for Luxon and date-fns
  - Create comprehensive test suite
  - Add STANDARD_PRESET and TRADITIONAL_PRESET configurations
  - Include detailed documentation in Korean and English
