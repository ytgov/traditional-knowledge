# Component Templates

**Location:** `web/src/components/{resource-names}/`

Create a folder named after the resource (plural, kebab-case).

---

## ResourceNamesDataTable.vue

Server-side paginated data table with search, sort, and actions.

```vue
<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="resourceNames"
    :items-length="totalCount"
    :loading="isLoading"
    @click:row="(_event: unknown, { item }: ResourceNameTableRow) => goToEditPage(item.id)"
  >
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #item.updatedAt="{ item }">
      {{ formatDate(item.updatedAt) }}
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex justify-end align-center">
        <v-btn
          :to="{
            name: 'admin/ResourceNamesEditPage',
            params: { resourceNameId: item.id },
          }"
          :loading="isDeleting"
          title="Edit"
          icon="mdi-pencil"
          size="x-small"
          color="primary"
          variant="outlined"
          @click.stop
        />
        <v-btn
          class="ml-2"
          :loading="isDeleting"
          title="Delete"
          icon="mdi-delete"
          size="x-small"
          color="error"
          variant="outlined"
          @click.stop="confirmThenDelete(item)"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import { formatDate } from "@/utils/formatters"
import resourceNamesApi from "@/api/resource-names-api"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useSnack from "@/use/use-snack"
import useResourceNames, {
  type ResourceNameAsIndex,
  type ResourceNameWhereOptions,
  type ResourceNameFiltersOptions,
} from "@/use/use-resource-names"

type ResourceNameTableRow = {
  item: ResourceNameAsIndex
}

const props = withDefaults(
  defineProps<{
    filters?: ResourceNameFiltersOptions
    where?: ResourceNameWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Created", key: "createdAt" },
  { title: "Updated", key: "updatedAt" },
  { title: "Actions", key: "actions", sortable: false },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  { key: "name", order: "asc" },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const resourceNamesQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { resourceNames, totalCount, isLoading, refresh } = useResourceNames(resourceNamesQuery)

const router = useRouter()

function goToEditPage(resourceNameId: number) {
  router.push({
    name: "admin/ResourceNamesEditPage",
    params: { resourceNameId },
  })
}

const snack = useSnack()
const isDeleting = ref(false)

async function confirmThenDelete(resourceName: ResourceNameAsIndex) {
  const { name } = resourceName

  const result = confirm(`Are you sure you want to delete ${name}?`)
  if (result === false) return

  isDeleting.value = true
  try {
    await resourceNamesApi.delete(resourceName.id)
    await refresh()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to delete resource name: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

defineExpose({ refresh })
</script>
```

---

## ResourceNameNameUniqueTextField.vue

Unique field validation wrapper for the name field.

```vue
<template>
  <UniqueTextField
    v-model="resourceNameName"
    label="Name"
    :check-availability="checkNameAvailability"
    unique-validation-message="Name must be unique"
    is-unique-message="Name is available"
    is-not-unique-message="Name is already taken"
  />
</template>

<script setup lang="ts">
import resourceNamesApi, {
  type ResourceNameFiltersOptions,
} from "@/api/resource-names-api"

import UniqueTextField from "@/components/common/UniqueTextField.vue"

const resourceNameName = defineModel<string | null | undefined>({
  required: true,
})

const props = withDefaults(
  defineProps<{
    filters?: ResourceNameFiltersOptions
  }>(),
  {
    filters: () => ({}),
  }
)

async function checkNameAvailability(name: string) {
  const { resourceNames } = await resourceNamesApi.list({
    where: { name },
    filters: props.filters,
    perPage: 1,
  })
  return resourceNames.length === 0
}
</script>
```

---

## ResourceNameCreateForm.vue

Create form embedded in NewPage (no skeleton loader needed).

```vue
<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card class="border">
      <v-card-title>New Resource Name</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <ResourceNameNameUniqueTextField
              v-model="resourceNameAttributes.name"
              label="Name *"
              :rules="[required]"
              required
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              :to="{ name: 'admin/ResourceNamesPage' }"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              class="ml-3"
              :loading="isLoading"
              type="submit"
              color="primary"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import resourceNamesApi, { type ResourceName } from "@/api/resource-names-api"
import useSnack from "@/use/use-snack"

import ResourceNameNameUniqueTextField from "@/components/resource-names/ResourceNameNameUniqueTextField.vue"

const resourceNameAttributes = ref<Partial<ResourceName>>({})

const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)
const snack = useSnack()
const router = useRouter()

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    await resourceNamesApi.create(resourceNameAttributes.value)
    snack.success("Resource name created.")
    router.push({ name: "admin/ResourceNamesPage" })
  } catch (error) {
    console.error(`Failed to create resource name: ${error}`, { error })
    snack.error(`Failed to create resource name: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
```

---

## ResourceNameEditForm.vue

Edit form with skeleton loader and save method from composable.

```vue
<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-skeleton-loader
      v-if="isNil(resourceName)"
      type="card"
    />
    <v-card v-else class="border">
      <v-card-title>Edit Resource Name</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <ResourceNameNameUniqueTextField
              v-model="resourceName.name"
              label="Name *"
              :rules="[required]"
              :filters="resourceNameNameFilters"
              required
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              v-bind="cancelButtonProps"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              class="ml-3"
              :loading="isLoading"
              type="submit"
              color="primary"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref, toRefs } from "vue"

import { type VBtn, type VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import useResourceName from "@/use/use-resource-name"
import useSnack from "@/use/use-snack"

import ResourceNameNameUniqueTextField from "@/components/resource-names/ResourceNameNameUniqueTextField.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    resourceNameId: number
    cancelButtonProps?: CancelButtonOptions
  }>(),
  {
    cancelButtonProps: () => ({
      to: { name: "admin/ResourceNamesPage" },
    }),
  }
)

const emit = defineEmits<{
  saved: [resourceNameId: number]
}>()

const { resourceNameId } = toRefs(props)
const { resourceName, save, isLoading } = useResourceName(resourceNameId)

const resourceNameNameFilters = computed(() => ({
  excludeById: resourceNameId.value,
}))

const snack = useSnack()
const form = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (isNil(resourceName.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    await save()
    snack.success("Resource name saved!")
    emit("saved", resourceName.value.id)
  } catch (error) {
    console.error(`Failed to save resource name: ${error}`, { error })
    snack.error(`Failed to save resource name: ${error}`)
  }
}
</script>
```

---

## Checklist

- [ ] Folder created: `web/src/components/{resource-names}/`
- [ ] DataTable uses `v-data-table-server` with route query persistence
- [ ] DataTable exposes `refresh()` method
- [ ] UniqueTextField wraps common component with model-specific labels
- [ ] UniqueTextField accepts `filters` prop for `excludeById`
- [ ] CreateForm has no skeleton loader (data always available)
- [ ] EditForm has skeleton loader with `v-if="isNil(resourceName)"`
- [ ] EditForm uses composable's `save()` method
- [ ] EditForm passes `excludeById` filter to unique fields
- [ ] All forms use `ref<InstanceType<typeof VForm> | null>(null)` pattern
- [ ] All forms validate before saving
