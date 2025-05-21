<template>
  <v-select
    v-model="accessLevel"
    :items="accessLevelOptions"
    label="Access Level"
  />
</template>

<script setup lang="ts">
import { InformationSharingAgreementAccessGrantAccessLevel } from "@/api/information-sharing-agreement-access-grants-api"

const accessLevel = defineModel<InformationSharingAgreementAccessGrantAccessLevel>({
  default: InformationSharingAgreementAccessGrantAccessLevel.READ,
})

const accessLevelOptions = [
  {
    title: "Read Only",
    value: InformationSharingAgreementAccessGrantAccessLevel.READ,
  },
  {
    title: "Read & Download",
    value: InformationSharingAgreementAccessGrantAccessLevel.READ_DOWNLOAD,
  },
  {
    title: "Edit",
    value: InformationSharingAgreementAccessGrantAccessLevel.EDIT,
  },
]
</script>
