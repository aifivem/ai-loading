# ai-loading

The loading screen (qb-loading's job) in the TGIANN style: the server's name, subtitle and tagline from ai-core's General settings, a background picture, the game's loading progress and tips from the admin panel. Depends on ai-core (brand, panel); no client script, no database.

## Decisions

- The page is the resource's `loadscreen` (package.json `fxLoadscreen: true`: postBuild writes `loadscreen 'dist/web/index.html'` and `loadscreen_manual_shutdown 'yes'` instead of a `ui_page`); ai-core's character scene closes it (`ShutdownLoadingScreenNui` once the scene stands), so the screen never shows the empty world.
- The data reaches the page through the connection handover, the only channel a loading screen has: the server answers `playerConnecting` with `deferrals.handover({ aiLoading: LoadingView })` (ai-core's `GetBranding`, the panel's background and tips, the lang table), the page reads `window.nuiHandoverData.aiLoading` when it opens. Handovers of several resources merge.
- The pictures ship in this resource (`public/backgrounds`, copies of ai-core's): while the loading screen shows, other resources' files are not downloaded yet.
- Progress comes from the game's loading screen messages (`loadProgress` with `loadFraction`, `onDataFileEntry` / `initFunctionInvoking` names): plain window messages with an `eventName`, not NUI actions, so the page listens to `message` itself (the one place `fivem-nui-react`'s `useNuiEvent` does not fit). The bar never goes back when the game starts a new stage at 0.
- No backdrop blur: there is no game view under a loading screen; the tip card is a solid panel.

## Contracts

- `resource/common/loading.ts`: `HANDOVER_KEY`, `LoadingView`. Panel `data/settings.json` (`sync: "admin"`: background, tips, seconds per tip).

## Entry points

- Server handover and panel: `resource/server/handover.ts`, `server/schema.ts`. Page: `web/src/App.tsx`; browser preview `bun run webdev` (mock in `web/src/dev/mock.ts`).
