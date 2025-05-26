<template>
  <h2 class="mb-3">Yukon's Traditional Knowledge Archive</h2>
  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <v-card class="border">
        <v-card-text>
          <p class="text-subtitle-1 mb-4">
            This Archive provides a safe and secure location for Yukon First Nations to share their
            Traditional Knowledge with the Yukon Government.
          </p>

          <v-row>
            <v-col cols="12">
              <ArchiveItemNewButton />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                <router-link :to="{ name: 'archive-items/ArchiveItemListPage' }"
                  >View the Archive Items</router-link
                >
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <VaultInfoCard />
      <VaultStatisticsCard />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import ArchiveItemNewButton from "@/components/archive-item/ArchiveItemNewButton.vue"
import VaultInfoCard from "@/components/common/VaultInfoCard.vue"
import VaultStatisticsCard from "@/components/common/VaultStatisticsCard.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Traditional Knowledge Home", [])
</script>

<style>
.v-card-item__prepend i {
  color: #7a7878;
}
</style>
