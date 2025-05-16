<template>
  <PageLoader message="Traditional Knowledge" />
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useRouter } from "vue-router"

import { useAuth0 } from "@auth0/auth0-vue"

import useCurrentUser from "@/use/use-current-user"
import PageLoader from "@/components/common/PageLoader.vue"
const router = useRouter()

const { fetch } = useCurrentUser()
const { isAuthenticated } = useAuth0()

watch(
  () => [isAuthenticated.value],
  async ([auth]) => {
    const user = await fetch()

    if (auth && user) {
      console.log("Pushing to dashboard", user)
      router.push("/dashboard")
    }
  },
  { immediate: true }
)
</script>
