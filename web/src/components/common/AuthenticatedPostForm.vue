<template>
  <v-form
    ref="formRef"
    :action="actionUrl"
    method="post"
    target="_blank"
    @submit.prevent="getAccessTokenAndSubmit"
  >
    <input
      type="hidden"
      name="HOISTABLE_AUTHORIZATION_TOKEN"
      :value="accessToken"
    />
    <slot
      name="activator"
      :props="mergedActivatorProps"
      :is-loading="isSubmitting"
    >
      <v-btn v-bind="mergedActivatorProps">
        {{ text }}
      </v-btn>
    </slot>
  </v-form>
</template>

<script lang="ts">
import { type ButtonHTMLAttributes } from "vue"
import { type VBtn } from "vuetify/components"

type ActivatorProps = VBtn["$props"] & ButtonHTMLAttributes
export { type ActivatorProps } // two line type definition avoids breaking Vue syntax highlighting
</script>

<script setup lang="ts">
import { computed, ref, nextTick, useTemplateRef } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { useDisplay } from "vuetify"
import { isNil } from "lodash"

const props = withDefaults(
  defineProps<{
    actionUrl: string
    text?: string
    activatorProps?: ActivatorProps
  }>(),
  {
    text: "Submit",
    activatorProps: () => ({}),
  }
)

const emit = defineEmits<{
  submitted: [void]
}>()

const { getAccessTokenSilently } = useAuth0()
const { smAndDown } = useDisplay()

const formRef = useTemplateRef("formRef")
const accessToken = ref<string | null>(null)
const isSubmitting = ref(false)

const mergedActivatorProps = computed(() => ({
  block: smAndDown.value,
  color: "primary",
  ...props.activatorProps,
  type: "submit" as const,
  loading: isSubmitting.value,
}))

async function getAccessTokenAndSubmit() {
  if (isNil(formRef.value)) {
    throw new Error("Form element is not available")
  }

  isSubmitting.value = true
  try {
    accessToken.value = await getAccessTokenSilently()
    await nextTick() // Wait for accessToken to be updated in the DOM

    formRef.value.submit()

    await nextTick()
    emit("submitted")
  } catch (error) {
    console.error(`Error fetching new access token: ${error}`, { error })
    throw error
  } finally {
    isSubmitting.value = false
  }
}
</script>
