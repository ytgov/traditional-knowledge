<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allInformationSharingAgreements"
    label="Information Sharing Agreement"
    hint="Search for an information sharing agreement."
    item-value="id"
    auto-select-first
    chips
    clearable
    no-filter
    persistent-hint
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template #chip="{ props: chipProps, item: { raw: result } }">
      <v-chip
        v-bind="chipProps"
        :text="result.title || `Agreement #${result.id}`"
      />
    </template>
    <template #item="{ props: itemProps, item: { raw: result } }">
      <v-list-item
        v-bind="safeItemProps(itemProps)"
        :title="result.title"
        :subtitle="getAgreementSubtitle(result)"
      />
    </template>
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
  type InformationSharingAgreement,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
} from "@/use/use-information-sharing-agreements"
</script>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, omit, uniqBy } from "lodash"

import { formatDate } from "@/utils/formatters"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useInformationSharingAgreements, {
  type InformationSharingAgreement,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
} from "@/use/use-information-sharing-agreements"

const props = defineProps<{
  modelValue: number | null | undefined
  where?: InformationSharingAgreementWhereOptions
  filters?: Omit<InformationSharingAgreementFiltersOptions, "search">
}>()

const emit = defineEmits<{
  "update:modelValue": [agreementId: number | null | undefined]
}>()

const agreementId = computed(() => props.modelValue)
const { informationSharingAgreement } = useInformationSharingAgreement(agreementId)

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

const agreementsQuery = computed(() => {
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
const { informationSharingAgreements, totalCount, isLoading, refresh } =
  useInformationSharingAgreements(agreementsQuery)

const allInformationSharingAgreements = computed<InformationSharingAgreement[]>(() => {
  if (isNil(informationSharingAgreement.value)) {
    return informationSharingAgreements.value
  }

  return uniqBy([...informationSharingAgreements.value, informationSharingAgreement.value], "id")
})

/**
 * Title is an attribute of the InformationSharingAgreement object, which overrides the title in the list item, so title must be removed.
 */
function safeItemProps(itemProps: Record<string, unknown>) {
  return omit(itemProps, ["title"])
}

function getAgreementSubtitle(agreement: InformationSharingAgreement): string {
  const startDate = agreement.startDate
    ? formatDate(new Date(agreement.startDate))
    : "No start date"
  const endDate = agreement.endDate ? formatDate(new Date(agreement.endDate)) : "No end date"
  return `${startDate} - ${endDate}`
}

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
