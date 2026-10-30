import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { isEnvBrowser } from "fivem-nui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import {
  HANDOVER_KEY,
  toLoadingView,
  type LoadingView,
} from "../../resource/common/loading";
import { MOCK_VIEW } from "./dev/mock";
import { setTexts, useLang } from "./lib/lang";

/** The page's data: ai-loading's part of the connection handover (the browser preview uses a mock). */
function readView(): LoadingView | null {
  const handover = (window as { nuiHandoverData?: Record<string, unknown> })
    .nuiHandoverData;
  return (
    toLoadingView(handover?.[HANDOVER_KEY]) ??
    (isEnvBrowser() ? MOCK_VIEW : null)
  );
}

/** Loading progress from the game's loading screen messages (`loadProgress` 0-1, the file being loaded). */
function useProgress(): { fraction: number; step: string } {
  const [fraction, setFraction] = useState(0);
  const [step, setStep] = useState("");
  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data.eventName !== "string") return;
      if (
        data.eventName === "loadProgress" &&
        typeof data.loadFraction === "number"
      ) {
        const next = data.loadFraction;
        // The game restarts the fraction per stage: the bar never goes back.
        setFraction((f) => Math.max(f, Math.min(1, next)));
      } else if (
        (data.eventName === "onDataFileEntry" ||
          data.eventName === "initFunctionInvoking") &&
        typeof data.name === "string"
      )
        setStep(data.name);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return { fraction, step };
}

/** One tip at a time, the next every `seconds` (a slow cross fade). */
function useTip(tips: string[], seconds: number): string | undefined {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (tips.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % tips.length),
      seconds * 1000,
    );
    return () => clearInterval(id);
  }, [tips, seconds]);
  return tips[index % Math.max(1, tips.length)];
}

export function App() {
  const [view] = useState(readView);
  const t = useLang();
  const { fraction, step } = useProgress();
  const tip = useTip(view?.tips ?? [], view?.tipSeconds ?? 7);
  useEffect(() => {
    if (view) setTexts(view.texts);
  }, [view]);
  if (!view) return <div className="bg-page fixed inset-0" />;
  const percent = Math.round(fraction * 100);
  return (
    <div className="bg-page text-text fixed inset-0 overflow-hidden font-sans select-none">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(../backgrounds/${view.background}.jpg)`,
        }}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(14,14,14,0.15)_0%,rgba(14,14,14,0.35)_45%,rgba(14,14,14,0.96)_100%)]" />

      {tip && (
        <div className="absolute top-[6vh] right-[6vh] w-[44vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tip}
              className="border-line-strong bg-panel flex gap-[1.6vh] rounded-[0.8vh] border px-[2vh] py-[1.8vh] [box-shadow:0_1vh_4vh_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-tgi-green-15 text-tgi-green flex size-[3.6vh] shrink-0 items-center justify-center rounded-[0.6vh]">
                <FontAwesomeIcon icon={faLightbulb} className="text-[1.6vh]" />
              </div>
              <div className="min-w-0">
                <div className="text-tgi-green text-xs font-semibold tracking-[0.12em] uppercase">
                  {t("LOADING_TIP")}
                </div>
                <div className="text-text-2 mt-[0.4vh] text-sm leading-[2.2vh]">
                  {tip}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="absolute right-[6vh] bottom-[6vh] left-[6vh]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-display text-[6.4vh] leading-none font-extrabold tracking-tight uppercase">
            {view.name}
          </div>
          {view.subtitle && (
            <div className="text-tgi-green mt-[1vh] text-[1.8vh] font-semibold tracking-[0.4em] uppercase">
              {view.subtitle}
            </div>
          )}
          {view.tagline && (
            <div className="text-text-3 mt-[1.4vh] text-base">
              {view.tagline}
            </div>
          )}
        </motion.div>

        <div className="mt-[4vh] flex items-end justify-between gap-[2vh]">
          <div className="text-text-4 min-w-0 truncate text-xs">
            {t("LOADING_TITLE")}
            {step && <span className="text-text-3 ml-[1vh]">{step}</span>}
          </div>
          <div className="font-display text-text text-[2.2vh] font-extrabold tabular-nums">
            {percent}%
          </div>
        </div>
        <div className="bg-control mt-[1.2vh] h-[0.5vh] overflow-hidden rounded-full">
          <motion.div
            className="bg-tgi-green h-full rounded-full [box-shadow:0_0_1.6vh_rgba(54,255,159,0.55)]"
            animate={{ width: `${Math.max(2, percent)}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
