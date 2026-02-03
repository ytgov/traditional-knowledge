<template>
  <v-card
    class="toggle fill-height"
    :to="{
      name: 'information-sharing-agreements/InformationSharingAgreementNewPage',
    }"
  >
    <v-card-text class="d-flex">
      <span class="d-sm-flex align-center me-3 d-none">
        <v-icon size="50px">mdi-file-document-edit</v-icon>
      </span>

      <div>
        <div class="text-h6">New Information Sharing Agreement</div>
        <span class="text-subtitle-2"
          >Create an Information Sharing Agreement for sharing traditional knowledge with the Yukon Government.</span
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Component for creating new Information Sharing Agreement
</script>
