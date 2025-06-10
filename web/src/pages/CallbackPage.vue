<template>
  <PageLoader message="Loading" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"

import PageLoader from "@/components/common/PageLoader.vue"

const router = useRouter()
const timeout = ref<number>()

onMounted(() => {
  timeout.value = setTimeout(() => {
    router.push({ name: "DashboardPage" })
  }, 5000)
})

onUnmounted(() => {
  clearTimeout(timeout.value)
})
</script>
