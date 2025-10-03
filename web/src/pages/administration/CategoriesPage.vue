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
        <CategoryNewButton />
      </div>

      <v-data-table-server
        v-model:items-per-page="perPage"
        :search="search"
        :items="categories"
        :items-length="totalCount"
        :page="page"
        :loading="isLoading"
        :headers="headers"
        @update:options="loadItems"
        @click:row="openItem"
      >
        <template #item.retention="{ item }">
          {{ item.retention?.name }}
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useCategories from "@/use/use-categories"
import { Category } from "@/api/categories-api"

import CategoryNewButton from "@/components/categories/CategoryNewButton.vue"

const router = useRouter()
const { isLoading, categories, totalCount, fetch } = useCategories()

console.log(categories)

onMounted(async () => {
  if (!isLoading.value) await loadItems()
})

const search = ref()
const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })

const headers = [
  { title: "Name", value: "name" },
  { title: "Description", value: "description" },
  { title: "Retention Policy", value: "retention" },
]

useBreadcrumbs("Categories", [
  ADMIN_CRUMB,
  { title: "Categories", to: { name: "administration/CategoriesPage" } },
])

async function loadItems() {
  fetch()
}
function openItem(_event: PointerEvent, { item }: { item: Category }) {
  router.push({ name: "administration/CategoryEditPage", params: { categoryId: item.id } })
}
</script>
