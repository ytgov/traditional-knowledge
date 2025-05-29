<template>
  <v-data-iterator
    :items-per-page="perPage"
    :page="page"
    :items="notifications"
    :items-length="totalCount"
    :loading="isLoading"
  >
    <template #loader>
      <v-skeleton-loader type="list-item-two-line" />
    </template>

    <template #default="{ items }">
      <v-list>
        <v-list-item
          v-for="({ raw: item }, index) of items"
          :key="index"
          :value="item"
          class="py-4 px-8"
          :base-color="item.readAt ? '' : 'error'"
          @click="markAsRead(item)"
        >
          <template #append>
            <v-btn
              v-if="item.href"
              size="x-small"
              class="mt-0 ml-2 align-top"
              icon="mdi-link-variant"
              :color="!item.readAt ? 'error' : 'success'"
              @click.stop="goToNotificationHref(item)"
            />
          </template>
          <p class="text-subtitle-1 font-weight-retular font-italic textSecondary">
            {{ formatDate(item.createdAt) }}
          </p>
          <div>
            <h6 class="text-subtitle-1 font-weight-semibold mb-1">{{ item.title }}</h6>
          </div>
          <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
        </v-list-item>
      </v-list>
    </template>

    <template #no-data>
      <v-list>
        <v-list-item class="py-4 px-8">
          <p class="text-subtitle-1 font-weight-retular font-italic textSecondary">
            No notifications found
          </p>
        </v-list-item>
      </v-list>
    </template>

    <template #footer="{ pageCount }">
      <v-pagination
        v-model="page"
        :length="pageCount"
      />
    </template>
  </v-data-iterator>
</template>

<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { formatDate } from "@/utils/formatters"

import notificationsApi from "@/api/notifications-api"

import useNotifications, {
  NotificationFiltersOptions,
  NotificationWhereOptions,
  NotificationQueryOptions,
  Notification,
} from "@/use/use-notifications"

const props = withDefaults(
  defineProps<{
    filters?: NotificationFiltersOptions
    where?: NotificationWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const router = useRouter()

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "5", { transform: Number })

const notificationsQuery = computed<NotificationQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { notifications, totalCount, isLoading, refresh } = useNotifications(notificationsQuery)

async function markAsRead(notification: Notification) {
  if (notification.readAt) return

  try {
    const { notification: updatedNotification } = await notificationsApi.read(notification.id)
    notification.readAt = updatedNotification.readAt
  } catch (error) {
    console.error(error)
  }
}

async function goToNotificationHref(notification: Notification) {
  await markAsRead(notification)

  if (notification.href) {
    router.push(notification.href)
  }
}

defineExpose({
  refresh,
})
</script>
