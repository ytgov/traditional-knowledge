<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card class="border">
      <v-card-title>New Information Sharing Agreement</v-card-title>
      <v-card-text>
        <v-row class="mt-2">
          <v-col>
            <InformationSharingAgreementBasicInformationCard
              v-model:title="informationSharingAgreementAttributes.title"
              v-model:purpose="informationSharingAgreementAttributes.purpose"
              v-model:sharing-group-contact-id="
                informationSharingAgreementAttributes.sharingGroupContactId
              "
              v-model:sharing-group-contact-title="
                informationSharingAgreementAttributes.sharingGroupContactTitle
              "
              v-model:receiving-group-contact-id="
                informationSharingAgreementAttributes.receivingGroupContactId
              "
              v-model:receiving-group-contact-title="
                informationSharingAgreementAttributes.receivingGroupContactTitle
              "
              class="border"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <AgreementDurationCard
              v-model:end-date="informationSharingAgreementAttributes.endDate"
              v-model:expiration-condition="
                informationSharingAgreementAttributes.expirationCondition
              "
              class="border"
            />
          </v-col>
        </v-row>

        <!-- Access & Confidentiality -->
        <v-row class="mt-4">
          <v-col cols="12">
            <AccessLevelDescriptionCard
              v-model:access-level="informationSharingAgreementAttributes.accessLevel"
              v-model:access-level-department-restriction="
                informationSharingAgreementAttributes.accessLevelDepartmentRestriction
              "
              v-model:access-level-branch-restriction="
                informationSharingAgreementAttributes.accessLevelBranchRestriction
              "
              v-model:access-level-unit-restriction="
                informationSharingAgreementAttributes.accessLevelUnitRestriction
              "
              v-model:has-additional-access-restrictions="
                informationSharingAgreementAttributes.hasAdditionalAccessRestrictions
              "
              v-model:additional-access-restrictions="
                informationSharingAgreementAttributes.additionalAccessRestrictions
              "
              class="border"
            />
          </v-col>
        </v-row>

        <!-- Confidentiality -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Confidentiality</h3>
          </v-col>
          <v-col
            cols="12"
            md="12"
          >
            <p class="mb-2">
              YG acknowledges the confidentiality and access identified above and will receive TK as
              / in:
            </p>
            <v-select
              v-model="informationSharingAgreementAttributes.confidentiality"
              :items="['ACCORDANCE', 'ACCEPTED IN CONFIDENCE']"
              label="Confidentiality"
              :rules="[required]"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="informationSharingAgreementAttributes.authorizedApplication"
              label="Authorised application of TK"
              auto-grow
              rows="2"
              :rules="[required]"
              required
            />
          </v-col>
        </v-row>

        <!-- Information Details -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Information Details</h3>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="informationSharingAgreementAttributes.detailLevel"
              label="Detail Level"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="informationSharingAgreementAttributes.formats"
              label="Formats"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="informationSharingAgreementAttributes.detailNotes"
              label="Detail Notes"
              auto-grow
              rows="2"
            />
          </v-col>
        </v-row>

        <!-- Credit & Attribution -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Credit & Attribution</h3>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="informationSharingAgreementAttributes.creditLines"
              label="Credit Lines"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="informationSharingAgreementAttributes.creditNotes"
              label="Credit Notes"
              auto-grow
              rows="2"
            />
          </v-col>
        </v-row>

        <!-- Terms & Conditions -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-2">Terms & Conditions</h3>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="informationSharingAgreementAttributes.expirationActions"
              label="Expiration Actions"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="informationSharingAgreementAttributes.expirationNotes"
              label="Expiration Notes"
              auto-grow
              rows="2"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="informationSharingAgreementAttributes.breachActions"
              label="Breach Actions"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="informationSharingAgreementAttributes.breachNotes"
              label="Breach Notes"
              auto-grow
              rows="2"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="informationSharingAgreementAttributes.disclosureNotes"
              label="Disclosure Notes"
              auto-grow
              rows="2"
            />
          </v-col>
        </v-row>

        <!-- File Upload -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-2">Attachment</h3>
          </v-col>
          <v-col cols="12">
            <v-file-input
              v-model="fileInput"
              label="Upload File"
              accept="*/*"
              prepend-icon="mdi-paperclip"
              @change="handleFileChange"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              :to="{
                name: 'administration/InformationSharingAgreementsPage',
              }"
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
import informationSharingAgreementsApi, {
  type InformationSharingAgreement,
} from "@/api/information-sharing-agreements-api"

import useSnack from "@/use/use-snack"

import AccessLevelDescriptionCard from "@/components/information-sharing-agreements/AccessLevelDescriptionCard.vue"
import AgreementDurationCard from "@/components/information-sharing-agreements/AgreementDurationCard.vue"
import InformationSharingAgreementBasicInformationCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationCard.vue"

const informationSharingAgreementAttributes = ref<Partial<InformationSharingAgreement>>({
  title: undefined,
  description: undefined,
  endDate: undefined,
  sharingGroupContactId: undefined,
  receivingGroupContactId: undefined,
  accessLevel: undefined,
  accessLevelDepartmentRestriction: undefined,
  accessLevelBranchRestriction: undefined,
  accessLevelUnitRestriction: undefined,
  additionalAccessRestrictions: undefined,
  hasAdditionalAccessRestrictions: undefined,
})

const form = ref<InstanceType<typeof VForm> | null>(null)
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

const fileInput = ref<File[]>([])

function handleFileChange() {
  if (fileInput.value && fileInput.value.length > 0) {
    const file = fileInput.value[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64Data = (e.target.result as string).split(",")[1]
        informationSharingAgreementAttributes.value.fileName = file.name
        informationSharingAgreementAttributes.value.fileMimeType = file.type
        informationSharingAgreementAttributes.value.fileSize = file.size
        informationSharingAgreementAttributes.value.fileData = base64Data

        console.log("File uploaded - frontend debug (create):", {
          fileName: file.name,
          fileSize: file.size,
          base64Length: base64Data.length,
          fileDataSet: !!informationSharingAgreementAttributes.value.fileData,
        })
      }
    }
    reader.readAsDataURL(file)
  }
}

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  console.log("About to create - frontend debug:", {
    hasFileData: !!informationSharingAgreementAttributes.value.fileData,
    fileDataLength: informationSharingAgreementAttributes.value.fileData?.length,
    fileName: informationSharingAgreementAttributes.value.fileName,
    allKeys: Object.keys(informationSharingAgreementAttributes.value),
  })

  isLoading.value = true
  try {
    await informationSharingAgreementsApi.create(informationSharingAgreementAttributes.value)
    snack.success("Information Sharing Agreement created.")
    router.push({
      name: "administration/InformationSharingAgreementsPage",
    })
  } catch (error) {
    console.error(`Failed to create information sharing agreement: ${error}`, { error })
    snack.error(`Failed to create information sharing agreement: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
