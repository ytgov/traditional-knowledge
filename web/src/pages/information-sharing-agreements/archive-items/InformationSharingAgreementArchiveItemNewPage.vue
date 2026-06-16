<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(informationSharingAgreement)"
    type="card"
  />
  <div v-else>
    <InformationSharingAgreementBasicInformationCard
      :title="informationSharingAgreement.title"
      :purpose="informationSharingAgreement.purpose"
      :external-group-contact-id="informationSharingAgreement.externalGroupContactId"
      :external-group-contact-title="informationSharingAgreement.externalGroupContactTitle"
      :internal-group-contact-id="informationSharingAgreement.internalGroupContactId"
      :internal-group-contact-title="informationSharingAgreement.internalGroupContactTitle"
      :internal-group-secondary-contact-id="
        informationSharingAgreement.internalGroupSecondaryContactId
      "
    >
      <template #title>
        <v-icon
          color="accent"
          icon="mdi-information-outline"
        />
        ISA Basic Information
      </template>
    </InformationSharingAgreementBasicInformationCard>

    <InformationSharingAgreementArchiveItemCreateForm
      class="mt-4"
      :information-sharing-agreement="informationSharingAgreement"
    />
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

import InformationSharingAgreementBasicInformationCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationCard.vue"
import InformationSharingAgreementArchiveItemCreateForm from "@/components/information-sharing-agreements/archive-items/InformationSharingAgreementArchiveItemCreateForm.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

const { informationSharingAgreement, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const breadcrumbs = computed(() => {
  return [
    BASE_CRUMB,
    {
      title: "Information Sharing Agreements",
      to: {
        name: "InformationSharingAgreementsPage",
      },
    },
    {
      title: informationSharingAgreement.value?.title ?? "Loading...",
      to: {
        name: "information-sharing-agreements/InformationSharingAgreementPage",
        params: {
          informationSharingAgreementId: props.informationSharingAgreementId,
        },
      },
    },
  ]
})

useBreadcrumbs("Create Knowledge Item from Agreement", breadcrumbs)
</script>
