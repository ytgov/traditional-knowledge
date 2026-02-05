<template>
  <v-expansion-panels
    v-model="selectedPanel"
    variant="accordion"
    flat
    rounded="lg"
  >
    <v-expansion-panel
      v-for="panel in panels"
      :key="panel.key"
      :value="panel.key"
      class="mb-3 border-sm"
      :class="{
        'border-md border-primary border-opacity-100': selectedPanel === panel.key,
      }"
    >
      <template #title>
        <div class="d-flex align-center flex-grow-1 overflow-hidden">
          <v-icon
            :color="selectedPanel === panel.key ? 'primary' : 'secondary'"
            class="mr-4"
          >
            {{ panel.icon }}
          </v-icon>
          <div class="overflow-hidden">
            <div
              class="font-weight-medium"
              :class="selectedPanel === panel.key ? 'text-h6' : 'text-subtitle-1'"
            >
              {{ panel.title }}
            </div>
            <div
              v-if="selectedPanel !== panel.key"
              class="text-caption text-medium-emphasis text-truncate"
            >
              <!-- Panel subtitle slots -->
              <slot :name="`${panel.key}.subtitle`">
                {{ panel.subtitle }}
              </slot>
            </div>
          </div>
        </div>
      </template>

      <v-divider v-if="selectedPanel === panel.key" />
      <template
        v-if="selectedPanel === panel.key"
        #text
      >
        <!-- Main content rendered in active panel -->
        <slot name="default"></slot>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
export type PanelDefinition = {
  key: string
  title: string
  icon: string
  subtitle?: string
  to: {
    name: string
    params?: Record<string, string | number>
  }
}
</script>

<script setup lang="ts">
import { watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { isNil } from "lodash"

const selectedPanel = defineModel<string | null>()

const props = defineProps<{
  panels: PanelDefinition[]
  to?: {
    name: string
    params?: Record<string, string | number>
  }
}>()

const route = useRoute()
const router = useRouter()

// Sync selected panel with current route
watch(
  () => route.name,
  (newRouteName) => {
    if (isNil(newRouteName)) return

    if (props.to?.name === newRouteName) {
      selectedPanel.value = null
      return
    }

    const matchingPanel = props.panels.find((panel) => panel.to.name === newRouteName)
    if (matchingPanel) {
      selectedPanel.value = matchingPanel.key
    }
  },
  { immediate: true }
)

// Navigate when panel changes (user clicks a different panel)
watch(selectedPanel, (newSelectedPanel) => {
  if (isNil(newSelectedPanel)) {
    if (props.to && props.to.name !== route.name) {
      router.push(props.to)
    }
    return
  }

  const panel = props.panels.find((panel) => panel.key === newSelectedPanel)
  if (panel && panel.to.name !== route.name) {
    router.push(panel.to)
  }
})
</script>
