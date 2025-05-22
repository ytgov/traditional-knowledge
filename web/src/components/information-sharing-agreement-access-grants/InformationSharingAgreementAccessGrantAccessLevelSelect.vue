<template>
  <v-select
    v-model="accessLevel"
    :items="accessLevelOptions"
    label="Access Level"
  />
</template>

<script setup lang="ts">
import { InformationSharingAgreementAccessGrantAccessLevels } from "@/api/information-sharing-agreement-access-grants-api"

const accessLevel = defineModel<InformationSharingAgreementAccessGrantAccessLevels>({
  default: InformationSharingAgreementAccessGrantAccessLevels.READ,
})

// TODO: move to translation file and use i18n
const accessLevelOptions = [
  {
    title: "Read Only",
    value: InformationSharingAgreementAccessGrantAccessLevels.READ,
  },
  {
    title: "Read & Download",
    value: InformationSharingAgreementAccessGrantAccessLevels.READ_DOWNLOAD,
  },
  {
    title: "Edit",
    value: InformationSharingAgreementAccessGrantAccessLevels.EDIT,
  },
  {
    title: "Admin",
    value: InformationSharingAgreementAccessGrantAccessLevels.ADMIN,
  },
]
</script>
