<template>
  <InformationSharingAgreementCard
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
    :edit-button-props="editButtonProps"
    :sign-button-props="signButtonProps"
  />

  <v-card class="mt-5 border">
    <!-- TODO: consider if we should have separate tabs for external and internal groups access grants? -->
    <v-tabs
      slider-color="primary"
      bg-color="#ffffff77"
    >
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
    <v-divider />

    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import InformationSharingAgreementCard from "@/components/information-sharing-agreements/InformationSharingAgreementCard.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

const router = useRouter()
const returnToHref = computed(() => {
  const routeLocation = router.resolve({
    name: "administration/information-sharing-agreements/InformationSharingAgreementPage",
    params: {
      informationSharingAgreementId: props.informationSharingAgreementId,
    },
  })
  return routeLocation.href
})

const editButtonProps = computed(() => ({
  to: {
    name: "administration/information-sharing-agreements/InformationSharingAgreementEditPage",
    params: {
      informationSharingAgreementId: props.informationSharingAgreementId,
    },
    query: {
      returnTo: returnToHref.value,
    },
  },
}))

const signButtonProps = computed(() => ({
  to: {
    name: "information-sharing-agreements/InformationSharingAgreementSignPage",
    params: {
      informationSharingAgreementId: props.informationSharingAgreementId,
    },
    query: {
      returnTo: returnToHref.value,
    },
  },
}))

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
