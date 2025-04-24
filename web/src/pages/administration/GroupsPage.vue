<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          class="mb-4 mr-5"
          label="Search"
          density="compact"
        />
        <!-- TODO: add group new page -->
        <!-- <v-btn
          color="primary"
          :to="{ name: 'groups/GroupNewPage' }"
          style="height: 40px"
        >
          New Group
        </v-btn> -->
        <v-btn
          color="primary"
          style="height: 40px"
        >
          New Group
        </v-btn>
      </div>

      <GroupsEditTable :search="search" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import GroupsEditTable from "@/components/groups/GroupsEditDataTableServer.vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

const search = ref("")

useBreadcrumbs("Groups", [ADMIN_CRUMB])
</script>
