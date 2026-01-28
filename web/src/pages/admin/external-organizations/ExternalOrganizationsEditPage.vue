<template>
  <ExternalOrganizationEditForm
    :external-organization-id="externalOrganizationIdAsNumber"
    :cancel-button-props="cancelButtonProps"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil, isEmpty, isString } from "lodash"
import { useRoute } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import ExternalOrganizationEditForm from "@/components/external-organizations/ExternalOrganizationEditForm.vue"

const props = defineProps<{
  externalOrganizationId: string
}>()

const externalOrganizationIdAsNumber = computed(() =>
  parseInt(props.externalOrganizationId)
)

const route = useRoute()
const cancelButtonProps = computed(() => {
  const rawReturnTo = route.query.returnTo
  if (isNil(rawReturnTo) || isEmpty(rawReturnTo) || !isString(rawReturnTo)) {
    return {
      to: {
        name: "admin/ExternalOrganizationsPage",
      },
    }
  }

  return {
    to: rawReturnTo,
  }
})

useBreadcrumbs("Edit Yukon First Nation", [
  ADMIN_CRUMB,
  {
    title: "Yukon First Nations",
    to: {
      name: "admin/ExternalOrganizationsPage",
    },
  },
])
</script>
