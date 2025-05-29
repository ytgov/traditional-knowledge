<template>
  <InformationSharingAgreementCard
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
    :edit-button-props="editButtonProps"
  />

  <v-card class="mt-5">
    <v-card-title>
      <!-- TODO: consider if we should have separate tabs for sharing and receiving groups access grants? -->
      <v-tabs>
        <v-tab
          :to="{
            name: 'administration/information-sharing-agreements/InformationSharingAgreementAccessGrantsPage',
            params: {
              informationSharingAgreementId,
            },
          }"
        >
          Access Grants
        </v-tab>
      </v-tabs>
    </v-card-title>

    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter, type RouteLocation } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import InformationSharingAgreementCard from "@/components/information-sharing-agreements/InformationSharingAgreementCard.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

const router = useRouter()
const editButtonProps = computed(() => {
  const routeLocation: RouteLocation & {
    href: string
  } = router.resolve({
    name: "administration/information-sharing-agreements/InformationSharingAgreementPage",
    params: {
      informationSharingAgreementId: props.informationSharingAgreementId,
    },
  })

  return {
    to: {
      name: "administration/information-sharing-agreements/InformationSharingAgreementEditPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
      query: {
        returnTo: routeLocation.href,
      },
    },
  }
})

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
