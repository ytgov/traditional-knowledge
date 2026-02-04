<template>
  <RoutableExpansionPanels
    :panels="panels"
    :to="{
      name: 'information-sharing-agreements/InformationSharingAgreementEditPage',
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    }"
  >
    <template #basic-information.subtitle>
      {{ basicInformationSubtitle }}
    </template>

    <template #duration.subtitle>
      {{ durationSubtitle }}
    </template>

    <template #access.subtitle>
      {{ accessSubtitle }}
    </template>

    <template #confidentiality.subtitle>
      {{ confidentialitySubtitle }}
    </template>

    <router-view class="mt-4" />
  </RoutableExpansionPanels>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { isNil } from "lodash"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

import RoutableExpansionPanels, {
  type PanelDefinition,
} from "@/components/common/RoutableExpansionPanels.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const { t } = useI18n()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const panels = computed<PanelDefinition[]>(() => [
  {
    key: "basic-information",
    title: "Basic Information",
    icon: "mdi-information-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditBasicInformationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
  },
  {
    key: "duration",
    title: "Agreement Duration & Expiration",
    icon: "mdi-clock-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditDurationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
  },
  {
    key: "access",
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
    key: "confidentiality",
    title: "Confidentiality",
    icon: "mdi-lock-outline",
    to: {
      name: "information-sharing-agreements/InformationSharingAgreementEditConfidentialityPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    },
  },
])

// Computed subtitle properties
const basicInformationSubtitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) return "Loading..."

  const { title } = informationSharingAgreement.value
  if (isNil(title)) return "Not configured"

  const parts = [title]
  const { sharingGroupContactName, receivingGroupContactName } = informationSharingAgreement.value
  if (sharingGroupContactName || receivingGroupContactName) {
    const contacts = [sharingGroupContactName, receivingGroupContactName]
      .filter(Boolean)
      .join(" & ")
    parts.push(contacts)
  }
  return parts.join(" | ")
})

const durationSubtitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) return "Loading..."

  const { expirationCondition } = informationSharingAgreement.value
  if (isNil(expirationCondition)) return "Not configured"

  const parts = [t(`informationSharingAgreement.expirationConditions.${expirationCondition}`)]
  const { endDate } = informationSharingAgreement.value
  if (!isNil(endDate)) {
    parts.push(endDate)
  }
  return parts.join(" | ")
})

const accessSubtitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) return "Loading..."

  const { accessLevel } = informationSharingAgreement.value
  if (isNil(accessLevel)) return "Not configured"
  return t(`informationSharingAgreement.accessLevels.${accessLevel}`)
})

const confidentialitySubtitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) return "Loading..."

  const { confidentialityType } = informationSharingAgreement.value
  if (isNil(confidentialityType)) return "Not configured"
  return t(`informationSharingAgreement.confidentialityTypes.${confidentialityType}`)
})

// Breadcrumbs
useBreadcrumbs("Information Sharing Agreement", [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])
</script>
