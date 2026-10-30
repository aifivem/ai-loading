import type { PanelSchema } from "@aicore-fivem/shared";

/** ai-loading's panel: the background and the tips the loading screen shows. */
export const loadingSchema: PanelSchema = {
  title: "ADMIN_TITLE",
  icon: "spinner",
  files: {
    settings: {
      kind: "settings",
      sync: "admin",
      sections: {
        background: { type: "enum", values: ["", "skyline", "wet-drive"] },
        tips: {
          type: "list",
          max: 30,
          of: {
            type: "object",
            fields: { text: { type: "text", min: 1, max: 160 } },
          },
        },
        tipSeconds: { type: "number", min: 3, max: 60, integer: true },
      },
    },
  },
  tabs: [
    {
      id: "screen",
      file: "settings",
      icon: "spinner",
      label: "ADMIN_TAB_SCREEN",
      desc: "ADMIN_TAB_SCREEN_DESC",
      cards: [
        {
          icon: "image",
          title: "ADMIN_C_LOOK",
          desc: "ADMIN_C_LOOK_DESC",
          fields: [
            {
              widget: "select",
              path: "background",
              label: "ADMIN_F_BACKGROUND",
              hint: "ADMIN_H_BACKGROUND",
              options: [
                { value: "", label: "ADMIN_O_BRAND" },
                { value: "skyline", label: "ADMIN_O_SKYLINE" },
                { value: "wet-drive", label: "ADMIN_O_WET_DRIVE" },
              ],
            },
          ],
        },
        {
          icon: "lightbulb",
          title: "ADMIN_C_TIPS",
          desc: "ADMIN_C_TIPS_DESC",
          fields: [
            {
              widget: "list",
              path: "tips",
              label: "ADMIN_F_TIPS",
              addLabel: "ADMIN_ADD_TIP",
              max: 30,
              newRow: { text: "" },
              rows: [
                {
                  widget: "text",
                  path: "text",
                  label: "ADMIN_F_TIP",
                  placeholder: "ADMIN_P_TIP",
                },
              ],
            },
            {
              widget: "number",
              path: "tipSeconds",
              label: "ADMIN_F_TIP_SECONDS",
              hint: "ADMIN_H_TIP_SECONDS",
              min: 3,
              max: 60,
              unit: "s",
            },
          ],
        },
      ],
    },
  ],
};
