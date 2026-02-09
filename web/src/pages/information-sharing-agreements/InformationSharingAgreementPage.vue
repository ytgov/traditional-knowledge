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
          <div class="d-flex flex-column flex-md-row ga-3">
            <template
              v-if="
                informationSharingAgreement.status === InformationSharingAgreementStatuses.DRAFT
              "
            >
              <InformationSharingAgreementDownloadDraftButton
                :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
              />
              <v-btn
                color="secondary"
                size="large"
                :to="{
                  name: 'information-sharing-agreements/InformationSharingAgreementSignPage',
                  params: {
                    informationSharingAgreementId,
                  },
                }"
              >
                Mark as Signed
              </v-btn>
            </template>
            <v-btn
              v-else-if="
                informationSharingAgreement.status === InformationSharingAgreementStatuses.SIGNED
              "
              color="warning"
              size="large"
              variant="outlined"
            >
              Revert to Draft
              <InformationSharingAgreementRevertToDraftDialog
                :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
                activator="parent"
                @success="refresh"
              />
            </v-btn>
          </div>

          <div class="d-flex flex-column flex-md-row justify-end ga-3">
            <v-btn
              v-if="
                policy?.update &&
                informationSharingAgreement.status === InformationSharingAgreementStatuses.DRAFT
              "
              color="primary"
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
              color="secondary"
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

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useInformationSharingAgreement, {
  InformationSharingAgreementStatuses,
} from "@/use/use-information-sharing-agreement"

import InformationSharingAgreementDownloadDraftButton from "@/components/information-sharing-agreements/InformationSharingAgreementDownloadDraftButton.vue"
import InformationSharingAgreementRevertToDraftDialog from "@/components/information-sharing-agreements/InformationSharingAgreementRevertToDraftDialog.vue"

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
const { informationSharingAgreement, policy, refresh } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const pageTitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) {
    return "loading..."
  }

  const { title } = informationSharingAgreement.value
  return title
})

useBreadcrumbs(pageTitle, [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])
</script>
