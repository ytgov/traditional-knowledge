<template>
  <InformationSharingAgreementEditForm
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
    :cancel-button-props="cancelButtonProps"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil, isEmpty, isString } from "lodash"
import { useRoute } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import InformationSharingAgreementEditForm from "@/components/information-sharing-agreements/InformationSharingAgreementEditForm.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

const route = useRoute()
const cancelButtonProps = computed(() => {
  const rawReturnTo = route.query.returnTo
  if (isNil(rawReturnTo) || isEmpty(rawReturnTo) || !isString(rawReturnTo)) {
    return {
      to: {
        name: "administration/InformationSharingAgreementsPage",
      },
    }
  }

  return {
    to: rawReturnTo,
  }
})

useBreadcrumbs("Edit Information Sharing Agreement", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
