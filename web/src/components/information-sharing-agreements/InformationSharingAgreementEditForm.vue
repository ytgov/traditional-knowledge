<template>
  <v-form ref="form" @submit.prevent="saveWrapper">
    <v-skeleton-loader v-if="isNil(informationSharingAgreement)" type="card" />
    <v-card v-else class="border">
      <v-card-title>Information Sharing Agreement Details</v-card-title>
      <v-card-text>
        <!-- Basic Information -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.title" label="Title *" :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.identifier" label="Identifier" :rules="[required]"
              required />
          </v-col>

          <v-col cols="12">
            <p class="mb-2">What is the purpose, work, program, decision, or project this TK will inform?</p>
            <v-textarea v-model="informationSharingAgreement.purpose" label="Purpose" auto-grow rows="2"
              :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <!-- TODO: consider using a v-date-input range type? -->
            <StringDateInput v-model="informationSharingAgreement.startDate" label="Start Date *" :rules="[required]"
              :max="informationSharingAgreement.endDate" required />
          </v-col>
          <v-col cols="12" md="6">
            <StringDateInput v-model="informationSharingAgreement.endDate" label="End Date *" :rules="[required]"
              :min="informationSharingAgreement.startDate" required />
          </v-col>
        </v-row>

        <!-- Sharing Group -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Sharing Group</h3>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.sharingGroupContactName"
              label="Sharing Group Contact Name" :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.sharingGroupContactTitle"
              label="Sharing Group Contact Title" :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea v-model="informationSharingAgreement.sharingGroupInfo" label="Sharing Group Information"
              auto-grow rows="4" :rules="[required]" required />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.sharingGroupSignedBy" label="Signed By"
              :hide-details="false" />
            <StringDateInput v-model="informationSharingAgreement.sharingGroupSignedDate" label="Signed Date" />
          </v-col>
        </v-row>

        <!-- Receiving Group -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Receiving Group</h3>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.receivingGroupContactName"
              label="Receiving Group Contact Name" :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.receivingGroupContactTitle"
              label="Receiving Group Contact Title" :rules="[required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea v-model="informationSharingAgreement.receivingGroupInfo" label="Receiving Group Information"
              auto-grow rows="4" :rules="[required]" required />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.receivingGroupSignedBy" label="Signed By"
              :hide-details="false" />
            <StringDateInput v-model="informationSharingAgreement.receivingGroupSignedDate" label="Signed Date" />
          </v-col>
        </v-row>

        <!-- Access & Confidentiality -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Access & Confidentiality</h3>
            <p class="mb-2">
              Authorised access to this TK is limited. Any YG employees who are authorised to consider
              this TK must have a work need that complies with the criteria of this agreement, adhere to the terms and
              conditions and uphold the equivalent protection standards YG would normally apply to information provided
              by another government that is considered:
            </p>
          </v-col>
          <v-col cols="12" md="12">
            <v-select v-model="informationSharingAgreement.accessLevels"
              :items="['INTERNAL', 'PROTECTED and LIMITED', 'CONFIDENTIAL and RESTRICTED', 'ADDITIONAL MEASURES']"
              label="Access Levels" :rules="[required]" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="informationSharingAgreement.accessNotes" label="Access Notes" auto-grow rows="2" />
          </v-col>
          <v-col cols="12" md="12">
            <p class="mb-2">YG acknowledges the confidentiality and access identified above and will receive TK as / in:
            </p>
            <v-select v-model="informationSharingAgreement.confidentiality"
              :items="['ACCORDANCE', 'ACCEPTED IN CONFIDENCE']" label="Confidentiality" :rules="[required]" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="informationSharingAgreement.authorizedApplication" label="Authorised application of TK"
              auto-grow rows="2" :rules="[required]" required />
          </v-col>
        </v-row>

        <!-- Information Details -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Information Details</h3>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.detailLevel" label="Detail Level" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.formats" label="Formats" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="informationSharingAgreement.detailNotes" label="Detail Notes" auto-grow rows="2" />
          </v-col>
        </v-row>

        <!-- Credit & Attribution -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-0">Credit & Attribution</h3>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.creditLines" label="Credit Lines" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea v-model="informationSharingAgreement.creditNotes" label="Credit Notes" auto-grow rows="2" />
          </v-col>
        </v-row>

        <!-- Terms & Conditions -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-2">Terms & Conditions</h3>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.expirationActions" label="Expiration Actions" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea v-model="informationSharingAgreement.expirationNotes" label="Expiration Notes" auto-grow
              rows="2" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="informationSharingAgreement.breachActions" label="Breach Actions" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea v-model="informationSharingAgreement.breachNotes" label="Breach Notes" auto-grow rows="2" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="informationSharingAgreement.disclosureNotes" label="Disclosure Notes" auto-grow
              rows="2" />
          </v-col>
        </v-row>

        <!-- File Upload -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-2">Attachment</h3>
          </v-col>
          <v-col v-if="informationSharingAgreement.fileName" cols="12">
            <div class="mb-2 d-flex align-center">
              <span>
                Current file: <strong>{{ informationSharingAgreement.fileName }}</strong>
                ({{ formatFileSize(informationSharingAgreement.fileSize) }})
              </span>
              <v-btn
                class="ml-3"
                color="error"
                variant="outlined"
                size="small"
                @click="removeFile"
              >
                Remove File
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12">
            <v-file-input v-model="fileInput" label="Upload File" accept="*/*" prepend-icon="mdi-paperclip"
              @change="handleFileChange" />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn :loading="isLoading" color="secondary" variant="outlined" v-bind="cancelButtonProps">
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn class="ml-3" :loading="isLoading" type="submit" color="primary">
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
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import StringDateInput from "@/components/common/StringDateInput.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    cancelButtonProps?: CancelButtonOptions
  }>(),
  {
    cancelButtonProps: ({ informationSharingAgreementId }) => ({
      to: {
        name: "administration/information-sharing-agreements/InformationSharingAgreementPage",
        params: {
          informationSharingAgreementId,
        },
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [informationSharingAgreementId: number]
}>()

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, save, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)

const snack = useSnack()
const form = ref<InstanceType<typeof VForm> | null>(null)

const fileInput = ref<File | null>(null)

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function handleFileChange() {
  if (fileInput.value) {
    const file = fileInput.value
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result && informationSharingAgreement.value) {
        const base64Data = (e.target.result as string).split(',')[1]
        informationSharingAgreement.value.fileName = file.name
        informationSharingAgreement.value.fileMimeType = file.type
        informationSharingAgreement.value.fileSize = file.size
        informationSharingAgreement.value.fileData = base64Data

        console.log("File uploaded - frontend debug:", {
          fileName: file.name,
          fileSize: file.size,
          base64Length: base64Data.length,
          fileDataSet: !!informationSharingAgreement.value.fileData
        })
      }
    }
    reader.readAsDataURL(file)
  }
}

function removeFile() {
  if (informationSharingAgreement.value) {
    informationSharingAgreement.value.fileName = null
    informationSharingAgreement.value.fileMimeType = null
    informationSharingAgreement.value.fileSize = null
    informationSharingAgreement.value.fileData = null
    fileInput.value = null

    console.log("File removed - frontend debug")
  }
}

async function saveWrapper() {
  if (isNil(informationSharingAgreement.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Information Sharing Agreement saved!")
    emit("saved", informationSharingAgreement.value.id)
  } catch (error) {
    console.error(`Failed to save information sharing agreement: ${error}`, { error })
    snack.error(`Failed to save information sharing agreement: ${error}`)
  }
}
</script>
