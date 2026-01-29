<template>
  <v-card>
    <v-card-title>Basic Information</v-card-title>
    <v-card-text>
      <v-row class="mt-4">
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            :model-value="title"
            label="Title *"
            :rules="[required]"
            required
            @update:model-value="emit('update:title', $event)"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            :model-value="purpose"
            label="What is the purpose, work, program, decision, or project this Traditional Knowledge (TK) will inform?"
            :rules="[required]"
            required
            auto-grow
            rows="8"
            @update:model-value="emit('update:purpose', $event)"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <UserSearchableAutocomplete
            :model-value="sharingGroupContactId"
            label="Yukon First Nation and Transboundary Contact Name"
            :where="sharingGroupContactWhere"
            :rules="[required]"
            required
            @click:clear="updateSharingGroupContactTitle(null)"
            @selected="updateSharingGroupContactTitle"
            @update:model-value="emit('update:sharingGroupContactId', $event)"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :model-value="sharingGroupContactTitle"
            label="Yukon First Nation and Transboundary Contact Title"
            :rules="[required]"
            required
            @update:model-value="emit('update:sharingGroupContactTitle', $event)"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <UserSearchableAutocomplete
            :model-value="receivingGroupContactId"
            label="Yukon Government (YG) Contact Name"
            :where="receivingGroupContactWhere"
            :rules="[required]"
            required
            @click:clear="updateReceivingGroupContactTitle(null)"
            @selected="updateReceivingGroupContactTitle"
            @update:model-value="emit('update:receivingGroupContactId', $event)"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :model-value="receivingGroupContactTitle"
            label="Yukon Government (YG) Contact Title"
            :rules="[required]"
            required
            @update:model-value="emit('update:receivingGroupContactTitle', $event)"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <UserSearchableAutocomplete
            :model-value="receivingGroupSecondaryContactId"
            label="Yukon Government (YG) Manager Contact Name *"
            :where="receivingGroupSecondaryContactWhere"
            hint="Typically the manager of the primary YG contact, but can be any appropriate internal contact."
            :rules="[required]"
            required
            @update:model-value="emit('update:receivingGroupSecondaryContactId', $event)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import { required } from "@/utils/validators"
import UserSearchableAutocomplete, {
  type UserAsIndex,
} from "@/components/users/UserSearchableAutocomplete.vue"

defineProps<{
  title: string | null | undefined
  purpose: string | null | undefined
  sharingGroupContactId: number | null | undefined
  sharingGroupContactTitle: string | null | undefined
  receivingGroupContactId: number | null | undefined
  receivingGroupContactTitle: string | null | undefined
  receivingGroupSecondaryContactId: number | null | undefined
}>()

const emit = defineEmits<{
  "update:title": [value: string | null | undefined]
  "update:purpose": [value: string | null | undefined]
  "update:sharingGroupContactId": [value: number | null | undefined]
  "update:sharingGroupContactTitle": [value: string | null | undefined]
  "update:receivingGroupContactId": [value: number | null | undefined]
  "update:receivingGroupContactTitle": [value: string | null | undefined]
  "update:receivingGroupSecondaryContactId": [value: number | null | undefined]
}>()

const sharingGroupContactWhere = computed(() => ({
  isExternal: true,
}))
const receivingGroupContactWhere = computed(() => ({
  isExternal: false,
}))
const receivingGroupSecondaryContactWhere = computed(() => ({
  isExternal: false,
}))

function updateSharingGroupContactTitle(user: UserAsIndex | null) {
  if (isNil(user)) {
    emit("update:sharingGroupContactTitle", null)
  } else {
    emit("update:sharingGroupContactTitle", user.title)
  }
}

function updateReceivingGroupContactTitle(user: UserAsIndex | null) {
  if (isNil(user)) {
    emit("update:receivingGroupContactTitle", null)
  } else {
    emit("update:receivingGroupContactTitle", user.title)
  }
}
</script>
