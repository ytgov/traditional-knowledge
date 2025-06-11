<template>
  <v-card
    class="toggle fill-height"
    :to="{
      name: 'archive-items/ArchiveItemNewPage',
    }"
  >
    <v-card-text class="d-flex">
      <span class="d-sm-flex align-center me-3 d-none">
        <v-icon size="50px">mdi-archive-plus</v-icon>
      </span>

      <div>
        <div class="text-h6">New Knowledge Item</div>
        <span class="text-subtitle-2"
          >Create a Knowledge Item by adding metadata and attaching files.</span
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup></script>
