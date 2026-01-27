import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type GroupAsReference } from "@/api/groups-api"
import { type InformationSharingAgreementAccessGrantAsReference } from "@/api/information-sharing-agreement-access-grants-api"

/** Keep in sync with api/src/models/user.ts */
export enum UserRoles {
  SYSTEM_ADMIN = "system_admin",
  USER = "user",
}

/**
 * Keep in sync with api/src/models/user.ts
 * information from https://yukon.ca/en/your-government/about-yukon/find-out-about-yukon-first-nations
 */
export enum UserYukonFirstNations {
  CARCROSS_TAGISH_FIRST_NATION = "Carcross/Tagish First Nation",
  CHAMPAGNE_AND_AISHIHIK_FIRST_NATIONS = "Champagne and Aishihik First Nations",
  COUNCIL_OF_YUKON_FIRST_NATIONS = "Council of Yukon First Nations",
  FIRST_NATION_OF_NACHO_NYAK_DUN = "First Nation of Na-Cho Nyäk Dun",
  KLUANE_FIRST_NATION = "Kluane First Nation",
  KWANLIN_DUN_FIRST_NATION = "Kwanlin Dün First Nation",
  LIARD_FIRST_NATION = "Liard First Nation",
  LITTLE_SALMON_CARMACKS_FIRST_NATION = "Little Salmon/Carmacks First Nation",
  ROSS_RIVER_DENA_COUNCIL = "Ross River Dena Council",
  SELKIRK_FIRST_NATION = "Selkirk First Nation",
  TAAN_KWACHAN_COUNCIL = "Ta'an Kwäch'än Council",
  TESLIN_TLINGIT_COUNCIL = "Teslin Tlingit Council",
  TRONDEK_HWECHIN = "Tr'ondëk Hwëch'in",
  VUNTUT_GWITCHIN_FIRST_NATION = "Vuntut Gwitchin First Nation",
  WHITE_RIVER_FIRST_NATION = "White River First Nation",
}

/** Keep in sync with api/src/models/user.ts */
export type User = {
  id: number
  createdById: number
  email: string
  auth0Subject: string
  activeDirectoryIdentifier: string | null
  isExternal: boolean
  firstName: string
  lastName: string
  displayName: string
  roles: UserRoles[]
  title: string | null
  department: string | null
  division: string | null
  branch: string | null
  unit: string | null
  phoneNumber: string | null
  yukonFirstNation: UserYukonFirstNations | null
  lastSyncSuccessAt: string | null
  lastSyncFailureAt: string | null
  deactivatedAt: string | null
  deactivationReason: string | null
  lastActiveAt: string | null
  emailNotificationsEnabled: boolean
  createdAt: string
  updatedAt: string
}

/** Keep in sync with api/src/serializers/users/index-serializer.ts */
export type UserAsIndex = Pick<
  User,
  | "id"
  | "createdById"
  | "email"
  | "auth0Subject"
  | "activeDirectoryIdentifier"
  | "isExternal"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "phoneNumber"
  | "yukonFirstNation"
  | "lastSyncSuccessAt"
  | "lastSyncFailureAt"
  | "deactivatedAt"
  | "deactivationReason"
  | "lastActiveAt"
  | "emailNotificationsEnabled"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
}

/** Keep in sync with api/src/serializers/users/show-serializer.ts */
export type UserAsShow = Pick<
  User,
  | "id"
  | "createdById"
  | "email"
  | "auth0Subject"
  | "activeDirectoryIdentifier"
  | "isExternal"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "phoneNumber"
  | "yukonFirstNation"
  | "lastSyncSuccessAt"
  | "lastSyncFailureAt"
  | "deactivatedAt"
  | "deactivationReason"
  | "lastActiveAt"
  | "emailNotificationsEnabled"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
} & {
  adminGroups: GroupAsReference[]
  adminInformationSharingAgreementAccessGrants: InformationSharingAgreementAccessGrantAsReference[]
}

/** Keep in sync with api/src/serializers/users/reference-serializer.ts */
export type UserAsReference = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "emailNotificationsEnabled"
>

export type UserPolicy = Policy

export type UserWhereOptions = WhereOptions<
  User,
  "email" | "title" | "department" | "division" | "branch" | "unit" | "emailNotificationsEnabled"
>

/** must match model scopes */
export type UserFiltersOptions = FiltersOptions<{
  search: string | string[]
  inGroup: number
  notInGroup: number
  withoutAccessGrantFor: number
  // TODO: implement isActive scope in back-end
}>

export type UserQueryOptions = QueryOptions<UserWhereOptions, UserFiltersOptions>

export const usersApi = {
  UserRoles,

  async list(params: UserQueryOptions = {}): Promise<{
    users: UserAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/users", {
      params,
    })
    return data
  },

  async get(userId: number): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.get(`/api/users/${userId}`)
    return data
  },

  async create(attributes: Partial<User>): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.post("/api/users", attributes)
    return data
  },

  async update(
    userId: number,
    attributes: Partial<User>
  ): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.patch(`/api/users/${userId}`, attributes)
    return data
  },

  async delete(userId: number): Promise<void> {
    const { data } = await http.delete(`/api/users/${userId}`)
    return data
  },

  // Stateful Actions
  async activate(userId: number): Promise<{ user: UserAsShow }> {
    const { data } = await http.delete(`/api/users/${userId}/deactivate`)
    return data
  },

  async deactivate(userId: number, attributes: Partial<User>): Promise<{ user: UserAsShow }> {
    const { data } = await http.post(`/api/users/${userId}/deactivate`, attributes)
    return data
  },

  // Special Actions
  async directorySync(userId: number): Promise<{
    user: UserAsShow
    policy: UserPolicy
  }> {
    const { data } = await http.post(`/api/users/${userId}/directory-sync`)
    return data
  },
}

export default usersApi
