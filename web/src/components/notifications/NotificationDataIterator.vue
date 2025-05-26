<template>
  <v-data-iterator
    :items-per-page="perPage"
    :page="page"
    :items="notifications"
    :items-length="totalCount"
    :loading="isLoading"
  >
    <template #default="{ items }">
      <v-list-item
        v-for="(item, index) of items"
        :key="index"
        :value="item"
        class="py-4 px-8"
        :base-color="item.raw.readAt ? '' : 'error'"
        @click="markAsRead(item.raw)"
      >
        <template #append>
          <v-btn
            v-if="item.raw.href"
            size="x-small"
            class="mt-0 ml-2 align-top"
            icon="mdi-link-variant"
            :color="!item.raw.readAt ? 'error' : 'success'"
            @click.stop="notificationClicked(item.raw)"
          ></v-btn>
        </template>
        <p class="text-subtitle-1 font-weight-retular font-italic textSecondary">
          {{ formatDate(item.raw.createdAt) }}
        </p>
        <div>
          <h6 class="text-subtitle-1 font-weight-semibold mb-1">{{ item.raw.title }}</h6>
        </div>
        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.raw.subtitle }}</p>
      </v-list-item>
    </template>
  </v-data-iterator>
</template>

<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router"
import { computed } from "vue"

import { formatDate } from "@/utils/formatters"

import notificationsApi from "@/api/notifications-api"

import { stringTransformer } from "@/utils/use-route-query-transformers"

import useNotifications, { NotificationWhereOptions, Notification } from "@/use/use-notifications"
import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"

const routeQuerySuffix = "Notifications"

const { page, perPage } = useRouteQueryPagination({
  perPage: 5,
  routeQuerySuffix,
})

const showFilter = useRouteQuery<string>(`show${routeQuerySuffix}`, "All", {
  transform: stringTransformer,
})

const where = computed<NotificationWhereOptions>(() => {
  if (showFilter.value === "Unread") {
    return { readAt: null }
  }

  return {}
})

const notificationsQuery = computed(() => ({
  where: where.value,
  perPage: perPage.value,
  page: page.value,
}))

const { notifications, totalCount, isLoading } = useNotifications(notificationsQuery)

async function markAsRead(notification: Notification) {
  if (notification.readAt) return

  try {
    const { notification: updatedNotification } = await notificationsApi.read(notification.id)
    notification.readAt = updatedNotification.readAt
  } catch (error) {
    console.error(error)
  }
}

const emit = defineEmits<{ clicked: [notification: Notification] }>()

async function notificationClicked(notification: Notification) {
  emit("clicked", notification)
}
</script>
