<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="externalOrganizations"
    :items-length="totalCount"
    :loading="isLoading"
    @click:row="(_event: unknown, { item }: ExternalOrganizationTableRow) => goToExternalOrganizationEditPage(item.id)"
  >
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #item.updatedAt="{ item }">
      {{ formatDate(item.updatedAt) }}
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex justify-end align-center">
        <v-btn
          :to="{
            name: 'admin/ExternalOrganizationsEditPage',
            params: {
              externalOrganizationId: item.id,
            },
          }"
          :loading="isDeleting"
          title="Edit"
          icon="mdi-pencil"
          size="x-small"
          color="primary"
          variant="outlined"
          @click.stop
        />
        <v-btn
          class="ml-2"
          :loading="isDeleting"
          title="Delete"
          icon="mdi-delete"
          size="x-small"
          color="error"
          variant="outlined"
          @click.stop="confirmThenDelete(item)"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import { formatDate } from "@/utils/formatters"
import externalOrganizationsApi from "@/api/external-organizations-api"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useSnack from "@/use/use-snack"
import useExternalOrganizations, {
  type ExternalOrganizationAsIndex,
  type ExternalOrganizationWhereOptions,
  type ExternalOrganizationFiltersOptions,
} from "@/use/use-external-organizations"

type ExternalOrganizationTableRow = {
  item: ExternalOrganizationAsIndex
}

const props = withDefaults(
  defineProps<{
    filters?: ExternalOrganizationFiltersOptions
    where?: ExternalOrganizationWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const headers = ref([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Created",
    key: "createdAt",
  },
  {
    title: "Updated",
    key: "updatedAt",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  {
    key: "name",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const externalOrganizationsQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { externalOrganizations, totalCount, isLoading, refresh } = useExternalOrganizations(externalOrganizationsQuery)

const router = useRouter()

function goToExternalOrganizationEditPage(externalOrganizationId: number) {
  router.push({
    name: "admin/ExternalOrganizationsEditPage",
    params: {
      externalOrganizationId,
    },
  })
}

const snack = useSnack()
const isDeleting = ref(false)

async function confirmThenDelete(externalOrganization: ExternalOrganizationAsIndex) {
  const { name } = externalOrganization

  const result = confirm(`Are you sure you want to delete ${name}.`)
  if (result === false) return

  isDeleting.value = true
  try {
    await externalOrganizationsApi.delete(externalOrganization.id)
    await refresh()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to delete Yukon First Nation: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

defineExpose({
  refresh,
})
</script>
