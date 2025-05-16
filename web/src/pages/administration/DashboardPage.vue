<template>
  <v-card class="border" title="Administration">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-card
            color="#fff"
            class="border"
            title="Users"
            subtitle="Manage Current Users"
            :to="{ name: 'users/UsersPage' }"
          >
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="#fff"
            class="border"
            title="Groups"
            subtitle="Manage Current Groups"
            :to="{
              name: 'administration/GroupsPage',
            }"
          >
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="#fff"
            class="border"
            title="Sources"
            subtitle="Manage Sources"
            :to="{ name: 'administration/SourceListPage' }"
          >
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="#fff"
            class="border"
            title="Retentions"
            subtitle="Manage Current Users"
            :to="{ name: 'administration/RetentionListPage' }"
          >
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="#fff"
            class="border"
            title="Categories"
            subtitle="Manage Current Users"
            :to="{ name: 'administration/CategoryListPage' }"
          >
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Administration Dashboard", [
  /* {
    title: "Administration Dashboard",
    to: { name: "administration/DashboardPage" },
  }, */
])
</script>
