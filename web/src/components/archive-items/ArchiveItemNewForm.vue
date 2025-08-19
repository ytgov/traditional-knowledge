<template>
  <v-form
    v-if="createItem"
    ref="form"
    v-model="isValid"
    @submit.prevent="saveWrapper"
  >
    <v-card class="border">
      <FileDrop @files-dropped="handleFileDrop">
        <v-card-title>Knowledge Item Description</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="createItem.title"
                label="Title"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <SecurityLevelSelect
                v-model="createItem.securityLevel"
                :rules="[rules.required]"
                label="Security level"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="createItem.description"
                label="Description"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Sharing Purpose</v-card-title>
        <v-card-text>
          <p class="mb-3">For what purpose this traditional knowledge is shared?</p>
          <v-textarea
            v-model="createItem.sharingPurpose"
            label="Sharing Purpose"
            rows="2"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-checkbox
            v-model="createItem.confidentialityReceipt"
            label="I confirm that I have received and agreed to the confidentiality terms."
            class="mt-3"
          />
        </v-card-text>

        <v-divider
          thickness="3"
          class="mb-4"
        ></v-divider>

        <v-card-title>Retention</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <RetentionSelect
                v-model="retentionId"
                :rules="[rules.required]"
                return-object
                label="Policy"
              />
            </v-col>
            <!--<v-col
              v-if="retentionId"
              cols="12"
              md="4"
              ><v-text-field
                :model-value="formatDate(createItem.calculatedExpireDate)"
                label="Expires on"
                append-inner-icon="mdi-lock"
                readonly
              />
            </v-col>
            <v-col
              v-if="retentionId"
              cols="12"
              md="4"
            >
              <v-text-field
                :model-value="createItem.expireAction"
                label="When item expires"
                append-inner-icon="mdi-lock"
                readonly
              />
            </v-col>
          -->
          </v-row>
        </v-card-text>
        
        <v-card-title>Yukon First Nation</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Please select the Yukon First Nations that this Traditional Knowledge pertains to. You
            can select as many as are applicable to this item. If it is not listed, please directly
            type in the name and click enter.
          </p>
          <YukonFirstNationsComboBox
            v-model="createItem.yukonFirstNations"
            label="Yukon First Nations"
            multiple
            chips
            clearable
            variant="outlined"
            :rules="[rules.required]"
          />
        </v-card-text>


        <v-card-title>Categories and Tags</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Categories and Tags are used as filter criteria to find items in the archive as well as
            determine who can see the items. You can select as many of each as are applicable to
            this item. Additional categories potentially increase the number of people that can see
            this information, but also make it more accessible in the future.
          </p>
          <CategorySelect
            v-model="createItem.categoryIds"
            :rules="[rules.required]"
            :hide-details="false"
            label="Categories"
            hide-selected
            clearable
            multiple
            chips
          />
          <v-combobox
            v-model="createItem.tags"
            label="Tags"
            multiple
            chips
            clearable
          />
        </v-card-text>

        <v-card-title>Attachments</v-card-title>

        <v-card-text>
          <p class="mb-4">Drag and drop files or click the box belox</p>
          <v-file-input
            v-model="createItem.files"
            multiple
            chips
            clearable
            label="Attachments"
          />

          <v-btn
            type="submit"
            class="mt-5"
            :disabled="!isValid"
            >Save</v-btn
          >
        </v-card-text>
      </FileDrop>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { isEmpty, isNil } from "lodash"
import { VForm } from "vuetify/components"

import useArchiveItemLegacy from "@/use/use-archive-item-legacy"
import useSnack from "@/use/use-snack"

import { SecurityLevel } from "@/api/archive-items-api"

import CategorySelect from "@/components/categories/CategorySelect.vue"
import FileDrop from "@/components/common/FileDrop.vue"
import RetentionSelect from "@/components/retentions/RetentionSelect.vue"
import SecurityLevelSelect from "@/components/archive-items/SecurityLevelSelect.vue"
import YukonFirstNationsComboBox from "@/components/archive-items/YukonFirstNationsComboBox.vue"


const rules = {
  required: (value: string | null) => !!value || "Field is required",

  email(value: string | null) {
    if (isNil(value) || isEmpty(value)) return true
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
    return "Must be a valid e-mail."
  },
}

const isValid = ref(false)

const snack = useSnack()
const router = useRouter()

const { createItem, isUpdate, save } = useArchiveItemLegacy(ref(null))

const isLoading = ref(false)
const retentionId = ref<number | null>(null)
const form = ref<InstanceType<typeof VForm> | null>(null)

onMounted(() => {
  createItem.value = {
    title: "",
    securityLevel: SecurityLevel.LOW,
    description: null,
    summary: null,
    sharingPurpose: "",
    confidentialityReceipt: false,
    yukonFirstNations: [],
    tags: [],
    files: [],
    categoryIds: [],
  }
})

watch(retentionId, () => {
  if (retentionId.value) {
    if (createItem.value) createItem.value.categoryIds = []
  }
})

function handleFileDrop(droppedFiles: File[]) {
  if (createItem.value) createItem.value.files = droppedFiles
}

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    console.log("Saving item", createItem.value)
    await save()

    if (isUpdate) snack.success("Item saved.")
    else snack.success("Item created.")

    router.push({ name: "archive-items/ArchiveItemListPage" })
    retentionId.value = null
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
