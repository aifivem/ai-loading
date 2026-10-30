import type { LoadingView } from "../../../resource/common/loading";

/** Browser preview data (`bun run webdev`): the handover a connecting player gets. */
export const MOCK_VIEW: LoadingView = {
  name: "Los Santos",
  subtitle: "Roleplay",
  tagline: "A city that never sleeps",
  background: "skyline",
  tips: [
    "Press F10 as an admin to open the panel and set up the whole server.",
    "Your car keys are in the radial menu.",
    "Jobs pay only while you are on duty.",
  ],
  tipSeconds: 5,
  texts: { LOADING_TITLE: "Loading the city", LOADING_TIP: "Tip" },
};
