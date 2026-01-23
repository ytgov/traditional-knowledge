<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card class="border">
      <v-card-title>User Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.firstName"
              label="First name *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.lastName"
              label="Last name *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.displayName"
              label="Display Name *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.title"
              label="Title"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.email"
              label="Email *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <!-- TODO: split user edit and user display into two separate components -->
            <v-text-field
              :model-value="formatRelative(user.lastActiveAt)"
              label="Last Accessed"
              append-inner-icon="mdi-clock-outline"
              readonly
              bg-color="grey-lighten-3"
            >
              <v-tooltip
                activator="parent"
                location="top"
              >
                {{ formatDateTime(user.lastActiveAt) }}
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-switch
              v-model="user.emailNotificationsEnabled"
              label="Receive email notifications"
              :false-value="false"
              :true-value="true"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>Organizational Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.department"
              label="Department"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.division"
              label="Division"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.branch"
              label="Branch"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.unit"
              label="Unit"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title>Roles</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <UserRolesSelect v-model="user.roles" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              v-bind="cancelButtonOptions"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              v-if="policy?.update"
              class="ml-3"
              :loading="isLoading"
              color="primary"
              variant="outlined"
              @click="sync"
            >
              <v-icon class="mr-2">mdi-sync</v-icon>
              Sync
            </v-btn>
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
import { ref, toRefs } from "vue"

import { type VBtn, type VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import { formatRelative, formatDateTime } from "@/utils/formatters"
import usersApi from "@/api/users-api"

import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"
import useUser from "@/use/use-user"

import UserRolesSelect from "@/components/users/UserRolesSelect.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    userId: number
    cancelButtonOptions?: CancelButtonOptions
  }>(),
  {
    cancelButtonOptions: ({ userId }) => ({
      to: {
        name: "UserPage",
        params: { userId },
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [userId: number]
}>()

const { userId } = toRefs(props)
const { user, policy, save, isLoading } = useUser(userId)

const form = ref<InstanceType<typeof VForm> | null>(null)
const snack = useSnack()
const { currentUser, refresh: refreshCurrentUser } = useCurrentUser<true>()

async function saveWrapper() {
  if (isNil(user.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    await save()

    if (user.value.id === currentUser.value.id) {
      await refreshCurrentUser()
      snack.info("Saved and reloaded current user!")
    } else {
      snack.success("User saved!")
    }

    emit("saved", user.value.id)
  } catch (error) {
    console.error(`Failed to save user: ${error}`, { error })
    snack.error(`Failed to save user: ${error}`)
  }
}

async function sync() {
  if (isNil(user.value)) return

  try {
    await usersApi.directorySync(user.value.id)

    if (user.value.id === currentUser.value.id) {
      await refreshCurrentUser()
      snack.info("Synced and reloaded current user!")
    } else {
      snack.success("User synced!")
    }

    emit("saved", user.value.id)
  } catch (error) {
    console.error(`Failed to sync user: ${error}`, { error })
    snack.error(`Failed to sync user: ${error}`)
  }
}
</script>
