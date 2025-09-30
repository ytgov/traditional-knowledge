<template>
  <v-form
    ref="formRef"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <v-card-title>Category Details</v-card-title>
      <v-card-text>
        <v-row
          v-if="category"
          class="mb-3"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="category.name"
              :rules="[required]"
              label="Name"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <!--<RetentionSelect
              v-model="category.retentionId"
              :rules="[rules.required]"
              label="Retention"
            /> -->
          </v-col>

          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="category.description"
              label="Description"
              rows="3"
            />
          </v-col>
        </v-row>

        <div class="d-flex">
          <v-btn
            :loading="isLoading"
            type="submit"
            text="Save"
          />
          <v-spacer />
          <v-btn
            color="secondary"
            variant="outlined"
            :to="{ name: 'administration/CategoriesPage' }"
            text="Cancel"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/components"

import { required } from "@/utils/validators"

import useSnack from "@/use/use-snack"
import useCategory from "@/use/use-category"

//import RetentionSelect from "../retentions/RetentionSelect.vue"

const props = defineProps<{
  categoryId: string | null
}>()

const categoryId = computed(() => (props.categoryId ? parseInt(props.categoryId) : null))

const snack = useSnack()
const router = useRouter()

const { category, isUpdate, save } = useCategory(categoryId)

const isLoading = ref(false)
const formRef = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    await save()

    if (isUpdate) snack.success("Category saved.")
    else snack.success("Category created.")

    router.push({ name: "administration/CategoriesPage" })
  } catch (error) {
    console.error(error)
    snack.error(`${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
