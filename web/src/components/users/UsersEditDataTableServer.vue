<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="users"
    :items-length="totalCount"
    :loading="isLoading"
    @click:row="(_event: unknown, { item }: UserTableRow) => goToUserEditPage(item.id)"
  >
    <template #item.lastActiveAt="{ item }">
      <span v-if="item.lastActiveAt">
        {{ formatRelative(item.lastActiveAt) }}
        <v-tooltip
          activator="parent"
          location="top"
        >
          {{ formatDateTime(item.lastActiveAt) }}
        </v-tooltip>
      </span>
      <span
        v-else
        class="text-grey"
      >
        Never
      </span>
    </template>
    <template #item.deactivatedAt="{ value }">
      <v-chip
        :color="isNil(value) ? 'success' : 'error'"
        size="small"
      >
        {{ isNil(value) ? "Active" : "Inactive" }}
      </v-chip>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex justify-end align-center">
        <v-btn
          v-if="isSystemAdmin"
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
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"
import { isNil } from "lodash"

import { formatRelative, formatDateTime } from "@/utils/formatters"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"

import usersApi from "@/api/users-api"
import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"
import useUsers, {
  type UserAsIndex,
  type UserFiltersOptions,
  type UserWhereOptions,
} from "@/use/use-users"

type UserTableRow = {
  item: UserAsIndex
}

const props = withDefaults(
  defineProps<{
    filters?: UserFiltersOptions
    where?: UserWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const { t } = useI18n()

const headers = ref([
  {
    title: "Display Name",
    key: "displayName",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Title",
    key: "title",
  },
  {
    title: "Department",
    key: "department",
    value: (item: unknown) => {
      const { department, division, branch, unit } = item as UserAsIndex
      return [department, division, branch, unit].filter(Boolean).join(" - ")
    },
  },
  {
    title: "Role",
    key: "roles",
    value: (item: unknown) => {
      const { roles } = item as UserAsIndex
      const formatedRoleTypes = roles.map((role) => t(`user.roles.${role}`, role))
      return formatedRoleTypes.join(", ")
    },
    sortable: false,
  },
  {
    title: "Status",
    key: "deactivatedAt",
  },
  {
    title: "Last Accessed",
    key: "lastActiveAt",
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
    key: "displayName",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const usersQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { users, totalCount, isLoading, refresh } = useUsers(usersQuery)

const { isSystemAdmin } = useCurrentUser()

const router = useRouter()

function goToUserEditPage(userId: number) {
  return router.push({
    name: "users/UserEditPage",
    params: {
      userId,
    },
  })
}

const snack = useSnack()
const isDeleting = ref(false)

async function confirmThenDelete(user: UserAsIndex) {
  const { displayName, email } = user
  const result = confirm(`Are you sure you want to delete ${displayName}: ${email}.`)
  if (result === false) return

  isDeleting.value = true
  try {
    await usersApi.delete(user.id)
    await refresh()
  } catch (error) {
    console.error(`Failed to delete user: ${error}`, { error })
    snack.error(`Failed to delete user: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

defineExpose({
  refresh,
})
</script>
