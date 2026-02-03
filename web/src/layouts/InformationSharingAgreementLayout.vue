<template>
  <v-expansion-panels
    :model-value="activePanel"
    variant="accordion"
    flat
    class="mx-auto"
    style="max-width: 1024px"
    rounded="lg"
    @update:model-value="navigateToPanel"
  >
    <v-expansion-panel
      v-for="panel in panels"
      :key="panel.to.name"
      :value="panel.to.name"
      class="mb-3 border-sm"
      :class="{
        'border-md border-primary border-opacity-100': activePanel === panel.to.name,
      }"
    >
      <v-expansion-panel-title>
        <div class="d-flex align-center flex-grow-1 overflow-hidden">
          <v-icon
            :color="activePanel === panel.to.name ? 'primary' : 'secondary'"
            class="mr-4"
          >
            {{ panel.icon }}
          </v-icon>
          <div class="overflow-hidden">
            <div
              class="font-weight-medium"
              :class="activePanel === panel.to.name ? 'text-h6' : 'text-subtitle-1'"
            >
              {{ panel.title }}
            </div>
            <div
              v-if="activePanel !== panel.to.name"
              class="text-caption text-medium-emphasis text-truncate"
            >
              {{ panel.buildTitle(informationSharingAgreement) }}
            </div>
          </div>
        </div>
      </v-expansion-panel-title>

      <v-divider />

      <v-expansion-panel-text v-if="activePanel === panel.to.name">
        <router-view class="mt-4" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { isNil } from "lodash"

import useInformationSharingAgreement, {
  type InformationSharingAgreement,
} from "@/use/use-information-sharing-agreement"
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

const router = useRouter()

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

type PanelDefinition = {
  index: number
  title: string
  icon: string
  to: {
    name: string
    params: {
      informationSharingAgreementId: string
    }
  }
  buildTitle: (informationSharingAgreement: InformationSharingAgreement | null) => string
}

const { t } = useI18n()

const panels: PanelDefinition[] = [
  {
    index: 0,
    title: "Basic Information",
    icon: "mdi-information",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditBasicInformationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
    buildTitle: (informationSharingAgreement) => {
      if (isNil(informationSharingAgreement)) return "Loading..."

      const { title } = informationSharingAgreement

      if (isNil(title)) return "Not configured"

      const parts = [title]

      const { sharingGroupContactName, receivingGroupContactName } = informationSharingAgreement
      if (sharingGroupContactName || receivingGroupContactName) {
        const contacts = [sharingGroupContactName, receivingGroupContactName]
          .filter(Boolean)
          .join(" & ")
        parts.push(contacts)
      }
      return parts.join(" | ")
    },
  },
  {
    index: 1,
    title: "Agreement Duration & Expiration",
    icon: "mdi-clock-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditDurationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
    buildTitle: (informationSharingAgreement) => {
      if (isNil(informationSharingAgreement)) return "Loading..."

      const { expirationCondition } = informationSharingAgreement
      if (isNil(expirationCondition)) return "Not configured"

      const parts = [t(`informationSharingAgreement.expirationConditions.${expirationCondition}`)]

      const { endDate } = informationSharingAgreement
      if (!isNil(endDate)) {
        parts.push(endDate)
      }

      return parts.join(" | ")
    },
  },
  {
    index: 2,
    title: "Access",
    icon: "mdi-key-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditAccessPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
    buildTitle: (informationSharingAgreement) => {
      if (isNil(informationSharingAgreement)) return "Loading..."

      const { accessLevel } = informationSharingAgreement
      if (isNil(accessLevel)) return "Not configured"

      return t(`informationSharingAgreement.accessLevels.${accessLevel}`)
    },
  },
  {
    index: 3,
    title: "Confidentiality",
    icon: "mdi-lock-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditConfidentialityPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
    buildTitle: (informationSharingAgreement) => {
      if (isNil(informationSharingAgreement)) return "Loading..."

      const { confidentialityType } = informationSharingAgreement
      if (isNil(confidentialityType)) return "Not configured"

      return t(`informationSharingAgreement.confidentiality.${confidentialityType}`)
    },
  },
]

const route = useRoute()
const activePanel = ref<string | null>(null)

onMounted(() => {
  initializeActivePanel()
})

function initializeActivePanel() {
  if (route.name === "information-sharing-agreements/InformationSharingAgreementPage") {
    activePanel.value = null
  } else if (!isNil(route.name)) {
    activePanel.value = route.name.toString()
  } else {
    activePanel.value = null
  }
}

async function navigateToPanel(panelName: string | null) {
  if (isNil(panelName)) {
    activePanel.value = null
    await nextTick()
    return router.push({
      name: "information-sharing-agreements/InformationSharingAgreementPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  }

  const panel = panels.find((panel) => panel.to.name === panelName)
  if (!isNil(panel) && panelName !== route.name) {
    activePanel.value = panelName
    await nextTick()
    return router.push(panel.to)
  }
}

useBreadcrumbs("Information Sharing Agreement", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
