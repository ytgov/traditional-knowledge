<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allExternalOrganizations"
    label="External Organization"
    hint="Search for an external organization."
    item-value="id"
    item-title="name"
    auto-select-first
    chips
    clearable
    no-filter
    persistent-hint
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template
      v-if="hasMore"
      #append-item
    >
      <v-divider />
      <v-list-item
        class="text-primary text-center"
        title="Show More"
        @click="nextPage"
      />
    </template>
  </v-autocomplete>
</template>

<!-- Special module scope (non-setup) required for exports -->
<script lang="ts">
export {
  type ExternalOrganizationAsIndex,
  type ExternalOrganizationWhereOptions,
  type ExternalOrganizationFiltersOptions,
} from "@/use/use-external-organizations"
</script>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, uniqBy } from "lodash"

import useExternalOrganization from "@/use/use-external-organization"
import useExternalOrganizations, {
  type ExternalOrganizationAsIndex,
  type ExternalOrganizationWhereOptions,
  type ExternalOrganizationFiltersOptions,
} from "@/use/use-external-organizations"

const props = defineProps<{
  modelValue: number | null | undefined
  where?: ExternalOrganizationWhereOptions
  filters?: Omit<ExternalOrganizationFiltersOptions, "search">
}>()

const emit = defineEmits<{
  "update:modelValue": [externalOrganizationId: number | null | undefined]
}>()

const externalOrganizationId = computed(() => props.modelValue)
const { externalOrganization } = useExternalOrganization(externalOrganizationId)

const searchToken = ref("")

function updateSearchToken(value: string) {
  searchToken.value = value
  page.value = 1
}

const debouncedUpdateSearchToken = debounce(updateSearchToken, 500)

const searchFilter = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return {}

  return {
    search: searchToken.value,
  }
})

const perPage = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return 100

  return 20
})

const page = ref(1)

const externalOrganizationsQuery = computed<{
  where?: ExternalOrganizationWhereOptions
  filters?: ExternalOrganizationFiltersOptions
  perPage: number
  page: number
}>(() => {
  return {
    where: props.where,
    filters: {
      ...props.filters,
      ...searchFilter.value,
    },
    perPage: perPage.value,
    page: page.value,
  }
})
const { externalOrganizations, totalCount, isLoading, refresh } = useExternalOrganizations(
  externalOrganizationsQuery
)

const allExternalOrganizations = computed<ExternalOrganizationAsIndex[]>(() => {
  if (isNil(externalOrganization.value)) {
    return externalOrganizations.value
  }

  return uniqBy([...externalOrganizations.value, externalOrganization.value], "id")
})

async function reset() {
  searchToken.value = ""
  await refresh()
}

watch(
  () => props.modelValue,
  async (newModelValue) => {
    if (isEmpty(newModelValue)) {
      await reset()
    }
  }
)

const hasMore = computed(() => page.value * perPage.value < totalCount.value)

function nextPage() {
  page.value += 1
}

defineExpose({
  reset,
})
</script>
