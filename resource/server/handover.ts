import { AdminPanel, resourceExport } from "@aicore-fivem/lib/server";
import { loadLocaleTexts } from "@aicore-fivem/lib/fivem";
import { HANDOVER_KEY, readSettings, type LoadingView } from "common/loading";
import { loadingSchema } from "./schema";

const core = resourceExport("ai-core");
const panel = new AdminPanel(loadingSchema);
const settings = panel.view("settings", readSettings);
const texts = loadLocaleTexts();

/** The page's view: ai-core's brand plus this panel's background and tips. */
function view(): LoadingView {
  const brand = core.GetBranding();
  const s = settings.value;
  return {
    name: brand.name,
    subtitle: brand.subtitle,
    tagline: brand.tagline,
    background: s.background || brand.background,
    tips: s.tips,
    tipSeconds: s.tipSeconds,
    texts,
  };
}

interface Deferrals {
  handover: (data: Record<string, unknown>) => void;
}

// The loading page reads it as `window.nuiHandoverData` the moment it opens (no event needed).
on(
  "playerConnecting",
  (_name: string, _kick: unknown, deferrals: Deferrals | undefined) => {
    deferrals?.handover({ [HANDOVER_KEY]: view() });
  },
);
