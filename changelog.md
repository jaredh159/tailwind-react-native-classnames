# Changelog

All notable changes to this project will be documented in this file. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[comment]: # 'Section Titles: Added/Fixed/Changed/Removed'

## [4.5.1] - 2024-08-23

- revised minimum RN version to 0.62.2 after testing, see
  [(#308)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/308)

## [4.5.0] - 2024-07-22

- added support for `size-*` shorthand utility
  [(#314)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/314) and
  [(#315)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/315)

## [4.4.0] - 2024-07-09

- added support for arbitrary named colors (eg. `text-[lemonchiffon]`)
  [(#306)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/306) and
  [(#309)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/309)

## [4.3.0] - 2024-06-18

- added support for line-height shorthand with font-size (eg. `text-sm/6`)
  [(#282)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/292) and
  [(#293)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/293)

## [4.2.0] - 2024-03-22

### Added

- added support for arbitrary viewport spacing (eg. `mx-[10vh]`)
  [(#285)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/285) and
  [(#287)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/287)
- added support for arbitrary flex-grow/shrink syntax (eg. `grow-[7]`)
  [(#146)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/146) and
  [(#287)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/287)

## [4.1.0] - 2024-03-06

### Added

- added Android-only text vertical align (thanks @menghany)
  [(#284)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/284)

## [4.0.2] - 2024-03-04

### Fixed

- fixed reading of app color scheme from multiple, nested components (thanks @crjc)
  [(#281)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/281) and
  [(#283)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/283)

## [4.0.1] - 2024-02-26

### Fixed

- when duplicate utilities, last now wins
  [(#245)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/245) and
  [(#279)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/279)
- resolve unusual color values from config in `tw.color()`
  [(#273)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/273) and
  [(#280)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/280)

## [4.0.0] - 2024-02-15

> See [migration guide](./migration-guide.md) for upgrading instructions.

### Added

- `tw.memoBuster` property for breaking memoization, [see here](./readme.md#memo-busting)
  for more details.

### Fixed

- media-query off by one pixel error
  [(#223)](https://github.com/jaredh159/tailwind-react-native-classnames/issues/223)
- initialization of color scheme when managing color scheme manually (not listening to
  device changes) (see
  [#266](https://github.com/jaredh159/tailwind-react-native-classnames/pull/266))

### Changed

- `useDeviceContext()` options when opting-out of listening to device color scheme changes
  (see [migration-guide](./migration-guide.md))
- `useAppColorScheme()` no longer allows initial value, moved to `useDeviceContext()` (see
  [migration guide](./migration-guide.md) and
  [#266](https://github.com/jaredh159/tailwind-react-native-classnames/pull/266))
- media-query minimum (see
  [#223](https://github.com/jaredh159/tailwind-react-native-classnames/issues/223))

## [3.6.9] - 2024-02-12

### Fixed

- edge case with dark-mode and color opacity shorthands
  [(#269)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/269)

## [3.6.8] - 2024-01-17

### Fixed

- support TS `moduleResolution: "NodeNext"` w/ `types` export
  [(#263)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/263)

### Changed

- update dev-only deps and config

## [3.6.7] - 2023-12-17

### Fixed

- fix breakpoint/prefix resolution of string-based custom utilities
  [(#259)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/259)

## [3.6.6] - 2023-12-11

### Fixed

- handle negative z-index utilities (e.g. `-z-30`)
  [(#258)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/258)

## [3.6.5] - 2023-11-29

### Fixed

- export documented `style` fn
  [(#255)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/255)

### Changed

- add test for media-query custom utility
  [(#255)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/255)
- codestyle: switch to explicit TS `type` imports
  [(#255)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/255)

## [3.6.4] - 2023-08-09

### Changed

- perf: ensure cached utilities referrentially equal to prevent re-renders
  [(#241)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/241)

## [3.6.3] - 2023-07-19

### Fixed

- support inset `auto` utilities (e.g. `top-auto`)
  [(#237)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/237)

## [3.6.2] - 2023-07-11

### Changed

- chore: support leading dots in custom utilities to improve intellisense
  [(#236)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/236)
- docs: add intellisense instructions to readme
  [(#228)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/228)
- docs: add expo dark mode note to readme
  [(#229)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/229)

## [3.6.1] - 2023-05-22

### Fixed

- fix ordering/cache issue with utility prefixes
  [(#227)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/227)

## [3.6.0] - 2023-01-18

### Added

- support flex-gap, newly supported in RN 0.71
  [(#212)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/212)

## [3.5.0] - 2022-12-12

### Added

- support flex-basis
  [(#204)](https://github.com/jaredh159/tailwind-react-native-classnames/pull/204)

---

[...more older releases, not documented here (yet)](https://github.com/jaredh159/tailwind-react-native-classnames/commits/master/?after=d3716f6549bfd0c392c8e00cf8a9892ba34e41ea+34)
