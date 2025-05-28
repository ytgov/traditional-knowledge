<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="list-item-two-line"
  />
  <v-list-item
    v-else
    v-bind="$attrs"
    :loading="isLoading"
    prepend-icon="mdi-handshake"
  >
    <template #append>
      <slot name="append"></slot>
    </template>
    <template #default>
      <p>
        <strong>{{ informationSharingAgreement.title }}</strong>
      </p>
      <p>
        {{ formatDate(informationSharingAgreement.startDate) }} -
        {{ formatDate(informationSharingAgreement.endDate) }}
      </p>
      <slot name="default"></slot>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import { formatDate } from "@/utils/formatters"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

defineSlots<{
  default(): unknown
  append(): unknown
}>()

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)
</script>
