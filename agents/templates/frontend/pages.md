# Page Templates

**Location:** `web/src/pages/admin/{resource-names}/`

Create a folder named after the resource (plural, kebab-case).

---

## ResourceNamesPage.vue (List Page)

Main list page with search and new button.

```vue
<template>
  <v-card class="border">
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <FilterSearchDebouncedTextField
          v-model="search"
          label="Search"
          density="compact"
        />
        <v-btn
          v-if="isSystemAdmin"
          color="primary"
          :to="{ name: 'admin/ResourceNamesNewPage' }"
          style="height: 40px"
        >
          New Resource Name
        </v-btn>
      </div>

      <ResourceNamesDataTable :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import ResourceNamesDataTable from "@/components/resource-names/ResourceNamesDataTable.vue"

const { isSystemAdmin } = useCurrentUser()

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Resource Names", [ADMIN_CRUMB])
</script>
```

---

## ResourceNamesNewPage.vue (Create Page)

Wrapper for CreateForm component.

```vue
<template>
  <ResourceNameCreateForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import ResourceNameCreateForm from "@/components/resource-names/ResourceNameCreateForm.vue"

useBreadcrumbs("New Resource Name", [
  ADMIN_CRUMB,
  {
    title: "Resource Names",
    to: { name: "admin/ResourceNamesPage" },
  },
])
</script>
```

---

## ResourceNamesEditPage.vue (Edit Page)

Wrapper for EditForm with route param conversion.

```vue
<template>
  <ResourceNameEditForm
    :resource-name-id="resourceNameIdAsNumber"
    :cancel-button-props="cancelButtonProps"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil, isEmpty, isString } from "lodash"
import { useRoute } from "vue-router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import ResourceNameEditForm from "@/components/resource-names/ResourceNameEditForm.vue"

const props = defineProps<{
  resourceNameId: string
}>()

const resourceNameIdAsNumber = computed(() =>
  parseInt(props.resourceNameId)
)

const route = useRoute()
const cancelButtonProps = computed(() => {
  const rawReturnTo = route.query.returnTo
  if (isNil(rawReturnTo) || isEmpty(rawReturnTo) || !isString(rawReturnTo)) {
    return {
      to: { name: "admin/ResourceNamesPage" },
    }
  }

  return {
    to: rawReturnTo,
  }
})

useBreadcrumbs("Edit Resource Name", [
  ADMIN_CRUMB,
  {
    title: "Resource Names",
    to: { name: "admin/ResourceNamesPage" },
  },
])
</script>
```

---

## Route Configuration

Add to `web/src/routes.ts`:

```typescript
{
  path: "/admin/resource-names",
  name: "admin/ResourceNamesPage",
  component: () => import("@/pages/admin/resource-names/ResourceNamesPage.vue"),
},
{
  path: "/admin/resource-names/new",
  name: "admin/ResourceNamesNewPage",
  component: () => import("@/pages/admin/resource-names/ResourceNamesNewPage.vue"),
},
{
  path: "/admin/resource-names/:resourceNameId",
  name: "admin/ResourceNamesEditPage",
  component: () => import("@/pages/admin/resource-names/ResourceNamesEditPage.vue"),
  props: true,
},
```

---

## Checklist

- [ ] Folder created: `web/src/pages/admin/{resource-names}/`
- [ ] All 3 pages created: List, New, Edit
- [ ] List page has search and new button
- [ ] List page checks `isSystemAdmin` for new button
- [ ] New page wraps CreateForm
- [ ] Edit page converts route param to number with `parseInt()`
- [ ] Edit page supports `returnTo` query param for cancel
- [ ] All pages set breadcrumbs with `useBreadcrumbs()`
- [ ] Routes added to `routes.ts` with lazy loading
- [ ] Edit route has `props: true`

## Key Patterns

### Route Param Conversion

Route params are always strings. Convert to number before passing to components:

```typescript
const props = defineProps<{
  resourceNameId: string  // From router
}>()

const resourceNameIdAsNumber = computed(() =>
  parseInt(props.resourceNameId)
)
```

### returnTo Query Param

Support dynamic cancel destination:

```typescript
const cancelButtonProps = computed(() => {
  const rawReturnTo = route.query.returnTo
  if (isNil(rawReturnTo) || isEmpty(rawReturnTo) || !isString(rawReturnTo)) {
    return { to: { name: "admin/ResourceNamesPage" } }
  }
  return { to: rawReturnTo }
})
```

### Breadcrumbs

Use `ADMIN_CRUMB` constant for consistent admin navigation:

```typescript
useBreadcrumbs("Page Title", [
  ADMIN_CRUMB,
  { title: "Parent", to: { name: "admin/ParentPage" } },
])
```
