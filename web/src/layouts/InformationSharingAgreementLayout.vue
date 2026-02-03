<template>
  <v-expansion-panels v-model="activePanel">
    <v-expansion-panel
      v-for="panel in panels"
      :key="panel.to.name"
      :value="panel.to.name"
    >
      <v-expansion-panel-title @click="goToRoute(panel.to)">
        <v-icon start>
          {{ panel.icon }}
        </v-icon>

        {{ panel.title }}
      </v-expansion-panel-title>

      <v-expansion-panel-text v-if="activePanel === panel.to.name">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

const router = useRouter()

const props = defineProps<{
  informationSharingAgreementId: string
}>()

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
}

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
  },
  {
    index: 1,
    title: "Duration",
    icon: "mdi-clock-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditDurationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
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
  },
]

const route = useRoute()
const activePanel = ref(route.name ?? panels[0].to.name)

function goToRoute(to: PanelDefinition["to"]) {
  return router.push(to)
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
