<template>
  <div style="background-color: #d2d7c9">
    <v-container
      v-if="breadcrumbsWithExactTrueByDefault.length > 0"
      fluid
      class="py-0 pb-2 mt-0 pt-2"
    >
      <h2 v-if="!mdAndUp">{{ title }}</h2>

      <v-breadcrumbs
        :items="breadcrumbsWithExactTrueByDefault"
        large
        class="pa-0 mb-0"
      >
        <template #title="{ item }">
          <transition
            name="breadcrumb-title-fade"
            mode="out-in"
          >
            <v-progress-circular
              v-if="isEmpty(item.title)"
              key="title-loader"
              size="16"
              color="secondary"
              width="1"
              indeterminate
            />
            <span
              v-else
              key="title-text"
            >
              {{ item.title }}
            </span>
          </transition>
        </template>
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </div>
</template>

<script lang="ts">
export { type Breadcrumb } from "@/use/use-breadcrumbs"
</script>

<script lang="ts" setup>
import { computed } from "vue"
import { isEmpty } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { useDisplay } from "vuetify"

const { mdAndUp } = useDisplay()
const { title, breadcrumbs } = useBreadcrumbs()

// Changes https://vuetifyjs.com/en/components/breadcrumbs/ default behavior.
// By default v-breadcrumbs will disable all crumbs up to the current page in a nested paths.
// You can prevent this behavior by using exact: true on each applicable breadcrumb in the items array.
const breadcrumbsWithExactTrueByDefault = computed(() =>
  breadcrumbs.value.map((item) => ({
    ...item,
    title: item.title ?? "",
    exact: item.exact ?? true,
    disabled: item.disabled ?? false,
  }))
)
</script>

<style scoped>
.breadcrumb-title-fade-enter-active,
.breadcrumb-title-fade-leave-active {
  transition: opacity 0.18s ease;
}
.breadcrumb-title-fade-enter-from,
.breadcrumb-title-fade-leave-to {
  opacity: 0;
}
</style>
