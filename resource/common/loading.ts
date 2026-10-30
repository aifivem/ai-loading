import { int, record, str } from "@aicore-fivem/lib/shared";

/** ai-loading's contracts and panel content. No natives. */

/** Key of this resource's part of the connection handover (`window.nuiHandoverData.aiLoading` in the page). */
export const HANDOVER_KEY = "aiLoading";

export type Background = "skyline" | "wet-drive";

/** What the loading page shows; sent once per connection through `deferrals.handover`. */
export interface LoadingView {
  name: string;
  subtitle: string;
  tagline: string;
  background: Background;
  tips: string[];
  tipSeconds: number;
  texts: Record<string, string>;
}

export interface Settings {
  /** "" = ai-core's brand background. */
  background: "" | Background;
  tips: string[];
  tipSeconds: number;
}

export function readSettings(value: unknown): Settings {
  const v = record(value);
  const tips = Array.isArray(v.tips)
    ? v.tips.flatMap((row) => {
        const text = str(record(row).text, "", 160);
        return text ? [text] : [];
      })
    : [];
  return {
    background:
      v.background === "skyline" || v.background === "wet-drive"
        ? v.background
        : "",
    tips,
    tipSeconds: int(v.tipSeconds, 7, 3, 60),
  };
}

/** The page's view from the handover, or null outside the game (browser preview). */
export function toLoadingView(value: unknown): LoadingView | null {
  const v = record(value);
  if (typeof v.name !== "string") return null;
  const texts: Record<string, string> = {};
  for (const [key, text] of Object.entries(record(v.texts)))
    if (typeof text === "string") texts[key] = text;
  return {
    name: v.name,
    subtitle: str(v.subtitle, "", 32),
    tagline: str(v.tagline, "", 64),
    background: v.background === "wet-drive" ? "wet-drive" : "skyline",
    tips: Array.isArray(v.tips)
      ? v.tips.filter((t): t is string => typeof t === "string")
      : [],
    tipSeconds: int(v.tipSeconds, 7, 3, 60),
    texts,
  };
}
