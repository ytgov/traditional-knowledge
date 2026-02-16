<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="informationSharingAgreementAccessGrants"
    :items-length="totalCount"
    :loading="isLoading"
    @click:row="
      (_event: unknown, { item }: InformationSharingAgreementAccessGrantTableRow) =>
        goToUserPage(item.userId)
    "
  >
    <template #item.group.name="{ item }">
      <GroupChip :group-id="item.groupId" />
    </template>
    <template #item.userId="{ item }">
      <UserChip :user-id="item.userId" />
    </template>
    <template #item.accessLevel="{ item }">
      {{ item.accessLevel }}
    </template>
    <template #item.creatorId="{ item }">
      <UserChip :user-id="item.creatorId" />
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
    <template #item.actions="{ item }">
      <div
        v-if="isAdminForInformationSharingAgreement(item.informationSharingAgreementId)"
        class="d-flex justify-end align-center"
      >
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
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"

import { formatDate } from "@/utils/formatters"
import informationSharingAgreementAccessGrantsApi from "@/api/information-sharing-agreement-access-grants-api"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"

import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"
import useInformationSharingAgreementAccessGrants, {
  type InformationSharingAgreementAccessGrantIndexView,
  type InformationSharingAgreementAccessGrantWhereOptions,
  type InformationSharingAgreementAccessGrantFiltersOptions,
} from "@/use/use-information-sharing-agreement-access-grants"

import GroupChip from "@/components/groups/GroupChip.vue"
import UserChip from "@/components/users/UserChip.vue"

type InformationSharingAgreementAccessGrantTableRow = {
  item: InformationSharingAgreementAccessGrantIndexView
}

const props = withDefaults(
  defineProps<{
    filters?: InformationSharingAgreementAccessGrantFiltersOptions
    where?: InformationSharingAgreementAccessGrantWhereOptions
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
    title: "Group",
    key: "group.name",
  },
  {
    title: "User",
    key: "userId",
    sortable: false,
  },
  {
    title: "Access Level",
    key: "accessLevel",
  },
  {
    title: "Creator",
    key: "creatorId",
  },
  {
    title: "Created At",
    key: "createdAt",
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
    key: "group.name",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const informationSharingAgreementAccessGrantsQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { informationSharingAgreementAccessGrants, totalCount, isLoading, refresh } =
  useInformationSharingAgreementAccessGrants(informationSharingAgreementAccessGrantsQuery)

const { isAdminForInformationSharingAgreement } = useCurrentUser<true>()

const router = useRouter()

function goToUserPage(userId: number) {
  // TODO: standardize this route to redirect to user read page (once a read page exists)
  return router.push({
    name: "users/UserEditPage",
    params: {
      userId,
    },
  })
}

const snack = useSnack()
const isDeleting = ref(false)

async function confirmThenDelete(
  informationSharingAgreementAccessGrant: InformationSharingAgreementAccessGrantIndexView
) {
  const { user } = informationSharingAgreementAccessGrant
  const { displayName, email } = user

  const result = confirm(
    `Are you sure you want to remove ${displayName}: ${email} from this information sharing agreement?`
  )
  if (result === false) return

  isDeleting.value = true
  try {
    await informationSharingAgreementAccessGrantsApi.delete(
      informationSharingAgreementAccessGrant.id
    )
    await refresh()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to remove information sharing agreement access grant: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

defineExpose({
  refresh,
})
</script>
