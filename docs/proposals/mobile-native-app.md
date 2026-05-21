# Native Mobile App with Expo

Add a React Native app to the monorepo as a fourth deployable touchpoint, built with Expo.

## Motivation

The repo's purpose is architectural experimentation, and native mobile is the obvious missing surface. The web stack already covers SSR, Module Federation, and PWA install / offline. Native opens a parallel set of experiments worth comparing against the web setup:

- **OTA updates without app store review**: `expo-updates` solves on native what Module Federation solves on web. Running both side by side makes the comparison concrete (delivery model, rollback, bundle sizing, security posture).
- **Shared design surface**: `@cohbrgr/figma` already emits tokens via Style Dictionary. Style Dictionary supports React Native output natively, so the same design source feeds both platforms.
- **Shared backend**: the existing Express API (`apps/api/`) is consumed identically.

## Scope

Location: `apps/mobile/`. Expo (managed workflow) with TypeScript, Expo Router for navigation, EAS Build for native binaries, `expo-updates` for OTA.

What ports cleanly:

| Package                 | Status            | Notes                                                           |
| ----------------------- | ----------------- | --------------------------------------------------------------- |
| `@cohbrgr/figma`        | Reuse             | Add a React Native output target to the Style Dictionary config |
| API (`apps/api/`)       | Reuse             | Same HTTP surface                                               |
| `@cohbrgr/localization` | Reuse if DOM-free | Verify no `document` / DOM assumptions; otherwise extract core  |
| `@cohbrgr/utils`        | Reuse             | Already framework-agnostic                                      |
| `@cohbrgr/components`   | Fork              | React DOM primitives do not port; native gets its own UI layer  |
| `@cohbrgr/server`       | Skip              | Express-only                                                    |
| `@cohbrgr/build`        | Skip              | Rspack config has no native equivalent (Expo uses Metro)        |

Initial app surface (mirrors web):

- Landing screen with identity / business card content
- Content screen consuming the same translations endpoint the web shell uses
- About / architecture screen

## Implementation

### Bundler choice: Metro (default) over Re.Pack

Expo ships with Metro. Re.Pack (Callstack) is the alternative that supports Module Federation on native, which would extend the existing MF thread. We pick Metro anyway:

- `expo-updates` is the more interesting experiment to run alongside web MF (different solution to the same problem).
- Re.Pack with Expo means ejecting from the managed workflow or using prebuild, losing most of Expo's value.
- Metro keeps EAS Build, EAS Update, and the Expo dev tooling intact.

Re.Pack stays open as a future experiment if the OTA comparison points toward wanting MF on native too.

### Monorepo integration

- Add `apps/mobile/` to `pnpm-workspace.yaml`.
- Metro's default resolver does not understand pnpm's symlinked `node_modules`. Use `@expo/metro-config` with the workspace-root option, or pin to a Metro config that walks the workspace. This is the main friction point.
- Nx project config for `lint` and `typecheck` targets. Build / deploy stays out of the Nx graph (EAS Build runs in Expo's cloud).

### Tokens

Extend `packages/figma/`'s Style Dictionary config to emit a `react-native` platform (`StyleSheet`-shaped output). Consume from `apps/mobile/` the same way `apps/shell/` consumes the web output.

### Updates and delivery

- EAS Build for store binaries (iOS TestFlight, Android internal track initially).
- EAS Update channel per environment (`production`, `preview`).
- Document the comparison: what kinds of changes go through OTA vs. require a new binary, vs. what MF allows on web.

## Plan

1. Scaffold `apps/mobile/` with `create-expo-app` (TypeScript template), wire into the workspace.
2. Configure Metro for pnpm + workspace resolution. Verify hot reload works against a workspace dependency.
3. Add React Native output to `@cohbrgr/figma`. Consume tokens from `apps/mobile/`.
4. Audit `@cohbrgr/localization` for DOM dependencies. Extract framework-agnostic core if needed.
5. Build the three initial screens (landing, content, about).
6. Set up EAS Build for iOS + Android (development + preview profiles).
7. Wire `expo-updates` with two channels.
8. TestFlight + Play Console internal track submission.
9. Document the OTA / MF comparison in `docs/`.

## Open Questions

- Does `@cohbrgr/localization` work without DOM, or does it need a split? Decision point before step 4.
- Single Apple / Google developer account, or use existing personal credentials? Affects EAS setup.
- Versioning: does the mobile app share the repo's CalVer, or get its own native versioning (CFBundleVersion / versionCode are integer-only on the stores)? Likely a mapping function, but worth pinning down.
- Should `apps/mobile/` ship a web target via Expo's web output, or strictly native? Strictly native keeps it from competing with `apps/shell/`.
- E2E coverage on native: Maestro, Detox, or skip until the surface justifies it?
