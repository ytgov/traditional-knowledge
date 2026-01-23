/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles - Note that order matters here!
import "@/assets/normalize.css"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import "@/assets/yk-style.css"

// Composables
import { createVuetify } from "vuetify"

import darkTheme from "@/theme/DarkTheme"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    variations: {
      colors: ["primary", "secondary"],
      lighten: 2,
      darken: 1,
    },
    defaultTheme: "darkTheme",
    themes: { darkTheme },
  },

  defaults: {
    VCard: {
      rounded: "md",
      flat: "true",
      color: "#E6E9E0",
    },
    VCardActions: {
      VBtn: {
        color: "primary",
      },
      class: "px-6 pb-5",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      bgColor: "#fff",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      bgColor: "#fff",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      bgColor: "#fff",
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      bgColor: "#fff",
    },
    VCombobox: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      bgColor: "#fff",
    },
    VDateInput: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideActions: true,
      hideDetails: "auto",
      bgColor: "#fff",
      prependIcon: "",
      appendInnerIcon: "$calendar",
    },
    VFileInput: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
      prependIcon: "",
      appendInnerIcon: "mdi-paperclip",
      bgColor: "#fff",
    },
    VListItem: {
      minHeight: "45px",
    },
    VTooltip: {
      location: "top",
    },
    VSwitch: {
      color: "primary",
      density: "compact",
      hideDetails: "auto",
      falseIcon: "mdi-close",
      trueIcon: "mdi-check",
      inset: true,
    },
    VBtn: { color: "primary", flat: "true" },
  },
})
