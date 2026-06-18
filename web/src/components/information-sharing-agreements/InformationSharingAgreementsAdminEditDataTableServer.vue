<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="informationSharingAgreements"
    :items-length="totalCount"
    :loading="isLoading"
    @click:row="
      (_event: unknown, { item }: InformationSharingAgreementTableRow) =>
        goToInformationSharingAgreementPage(item.id)
    "
  >
    <template #item.externalGroupId="{ item }">
      <em v-if="isNil(item.externalGroupId) || isNil(item.externalGroupContactId)"
        >No external group</em
      >
      <template v-else>
        <GroupChip :group-id="item.externalGroupId" />
        <UserChip :user-id="item.externalGroupContactId" />
      </template>
    </template>
    <template #item.internalGroupId="{ item }">
      <em v-if="isNil(item.internalGroupId) || isNil(item.internalGroupContactId)"
        >No internal group</em
      >
      <template v-else>
        <GroupChip :group-id="item.internalGroupId" />
        <UserChip :user-id="item.internalGroupContactId" />
      </template>
    </template>
    <template #item.creatorId="{ item }">
      <UserChip :user-id="item.creatorId" />
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"
import { isNil } from "lodash"

import { formatDate } from "@/utils/formatters"

import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useInformationSharingAgreements, {
  type InformationSharingAgreementAsIndex,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
} from "@/use/use-information-sharing-agreements"

import GroupChip from "@/components/groups/GroupChip.vue"
import UserChip from "@/components/users/UserChip.vue"

type InformationSharingAgreementTableRow = {
  item: InformationSharingAgreementAsIndex
}

const props = withDefaults(
  defineProps<{
    filters?: InformationSharingAgreementFiltersOptions
    where?: InformationSharingAgreementWhereOptions
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
    title: "Title",
    key: "title",
    minWidth: "300px",
  },
  {
    title: "External Group",
    key: "externalGroupId",
  },
  {
    title: "Internal Group",
    key: "internalGroupId",
  },
  {
    title: "Start Date",
    key: "startDate",
    value: (item: unknown) => {
      const { startDate } = item as InformationSharingAgreementAsIndex
      return formatDate(startDate)
    },
  },
  {
    title: "End Date",
    key: "endDate",
    value: (item: unknown) => {
      const { endDate } = item as InformationSharingAgreementAsIndex
      return formatDate(endDate)
    },
  },
  {
    title: "Creator",
    key: "creatorId",
  },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  {
    key: "title",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const informationSharingAgreementsQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { informationSharingAgreements, totalCount, isLoading, refresh } =
  useInformationSharingAgreements(informationSharingAgreementsQuery)

const router = useRouter()

function goToInformationSharingAgreementPage(informationSharingAgreementId: number) {
  router.push({
    name: "administration/information-sharing-agreements/InformationSharingAgreementPage",
    params: {
      informationSharingAgreementId,
    },
  })
}

defineExpose({
  refresh,
})
</script>
