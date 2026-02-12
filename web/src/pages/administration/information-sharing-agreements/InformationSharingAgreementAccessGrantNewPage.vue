<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="table"
  />
  <v-alert
    v-else-if="isNil(groupId)"
    type="error"
    title="You are not a contact (admin) for this information sharing agreement"
  />
  <InformationSharingAgreementAccessGrantCreateForm
    v-else
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
    :group-id="groupId"
  />
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

import InformationSharingAgreementAccessGrantCreateForm from "@/components/information-sharing-agreement-access-grants/InformationSharingAgreementAccessGrantCreateForm.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

const { currentUser } = useCurrentUser<true>()

const { informationSharingAgreement } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

// TODO: come up with a better way to handle this?
// Preferably by an association on the user or by UI design that ensures users are attempting to create
// permissions for the correct group
const groupId = computed(() => {
  if (isNil(informationSharingAgreement.value)) return null

  const { externalGroupContactId, externalGroupId, internalGroupContactId, internalGroupId } =
    informationSharingAgreement.value
  if (currentUser.value.id === externalGroupContactId) {
    return externalGroupId
  } else if (currentUser.value.id === internalGroupContactId) {
    return internalGroupId
  } else {
    return null
  }
})

useBreadcrumbs("Grant Access", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
