<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card@4"
  />
  <v-container
    v-else
    class="pa-0"
  >
    <v-row>
      <v-col>
        <InformationSharingAgreementBasicInformationCard
          class="rounded-lg"
          :title="informationSharingAgreement.title"
          :purpose="informationSharingAgreement.purpose"
          :sharing-group-contact-id="informationSharingAgreement.sharingGroupContactId"
          :sharing-group-contact-title="informationSharingAgreement.sharingGroupContactTitle"
          :receiving-group-contact-id="informationSharingAgreement.receivingGroupContactId"
          :receiving-group-contact-title="informationSharingAgreement.receivingGroupContactTitle"
          :receiving-group-secondary-contact-id="
            informationSharingAgreement.receivingGroupSecondaryContactId
          "
        />

        <InformationSharingAgreementDurationCard
          class="mt-6 rounded-lg"
          :expiration-condition="informationSharingAgreement.expirationCondition"
          :end-date="informationSharingAgreement.endDate"
        />

        <InformationSharingAgreementAccessCard
          class="mt-6 rounded-lg"
          :access-level="informationSharingAgreement.accessLevel"
          :access-level-department-restriction="
            informationSharingAgreement.accessLevelDepartmentRestriction
          "
          :access-level-branch-restriction="
            informationSharingAgreement.accessLevelBranchRestriction
          "
          :access-level-unit-restriction="informationSharingAgreement.accessLevelUnitRestriction"
          :has-additional-access-restrictions="
            informationSharingAgreement.hasAdditionalAccessRestrictions
          "
          :additional-access-restrictions="informationSharingAgreement.additionalAccessRestrictions"
        />

        <InformationSharingAgreementConfidentialityCard
          class="mt-6 rounded-lg"
          :confidentiality-type="informationSharingAgreement.confidentialityType"
          :authorized-application="informationSharingAgreement.authorizedApplication"
        />

        <div class="mt-4 d-flex flex-column flex-md-row justify-space-between ga-3 px-6 py-4">
          <AuthenticatedPostForm
            :action-url="acknowledgementTemplateUrl"
            text="Print for Signature"
            :activator-props="{
              color: 'primary',
              size: 'large',
            }"
          />
          <div class="d-flex flex-column flex-md-row justify-end ga-3">
            <v-btn
              color="secondary"
              size="large"
              :to="{
                name: 'information-sharing-agreements/InformationSharingAgreementEditBasicInformationPage',
                params: {
                  informationSharingAgreementId,
                },
              }"
            >
              Edit Agreement
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              :to="{
                name: 'InformationSharingAgreementsPage',
              }"
            >
              Back to List
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import informationSharingAgreementsApi from "@/api/information-sharing-agreements-api"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

import AuthenticatedPostForm from "@/components/common/AuthenticatedPostForm.vue"

import InformationSharingAgreementBasicInformationCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationCard.vue"
import InformationSharingAgreementDurationCard from "@/components/information-sharing-agreements/InformationSharingAgreementDurationCard.vue"
import InformationSharingAgreementAccessCard from "@/components/information-sharing-agreements/InformationSharingAgreementAccessCard.vue"
import InformationSharingAgreementConfidentialityCard from "@/components/information-sharing-agreements/InformationSharingAgreementConfidentialityCard.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const acknowledgementTemplateUrl = computed(() => {
  return informationSharingAgreementsApi.acknowledgementTemplatePath(
    informationSharingAgreementIdAsNumber.value
  )
})

const pageTitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) {
    return "loading..."
  }

  const { title } = informationSharingAgreement.value
  return title
})

useBreadcrumbs(pageTitle.value, [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])
</script>
