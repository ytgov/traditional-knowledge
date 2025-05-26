<template>
  <h3 class="text-h3 mb-4">Notifications</h3>

  <AppCard>
    <v-btn-toggle
      v-model="showFilter"
      color="info"
      group
      mandatory
      style="border: 1px #b0b0b0 solid !important; border-radius: 6px"
      @update:model-value="page = 1"
    >
      <v-btn
        value="All"
        style="width: 100px; border-left: 1px #b0b0b0 solid"
        text="All"
      />
      <v-btn
        value="Unread"
        style="width: 100px; border-left: 1px #b0b0b0 solid"
        text="Unread"
      />
    </v-btn-toggle>

    <v-list
      class="py-0 mt-4"
      lines="two"
    >
      <NotificationDataIterator @clicked="openNotification" />
    </v-list>
  </AppCard>
</template>

<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"

import { stringTransformer } from "@/utils/use-route-query-transformers"
import notificationsApi from "@/api/notifications-api"

import { Notification } from "@/use/use-notifications"

import AppCard from "@/components/common/AppCard.vue"
import NotificationDataIterator from "@/components/notifications/NotificationDataIterator.vue"

const routeQuerySuffix = "Notifications"

const showFilter = useRouteQuery<string>(`show${routeQuerySuffix}`, "All", {
  transform: stringTransformer,
})

async function markAsRead(notification: Notification) {
  if (notification.readAt) return

  try {
    const { notification: updatedNotification } = await notificationsApi.read(notification.id)
    notification.readAt = updatedNotification.readAt
  } catch (error) {
    console.error(error)
  }
}

const router = useRouter()

async function openNotification(notification: Notification) {
  await markAsRead(notification)

  if (notification.href) {
    router.push(notification.href)
  }
}
</script>
