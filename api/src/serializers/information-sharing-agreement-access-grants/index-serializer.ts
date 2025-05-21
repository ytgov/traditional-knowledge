import { isNil, isUndefined, pick } from "lodash"

import { InformationSharingAgreementAccessGrant } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import {
  ShowSerializer as GroupShowSerializer,
  type GroupShowView,
} from "@/serializers/groups/show-serializer"
import {
  ReferenceSerializer as UserReferenceSerializer,
  type UserReferenceView,
} from "@/serializers/users/reference-serializer"

export type AccessGrantIndexView = Pick<
  InformationSharingAgreementAccessGrant,
  | "id"
  | "informationSharingAgreementId"
  | "groupId"
  | "userId"
  | "accessLevel"
  | "creatorId"
  | "createdAt"
  | "updatedAt"
> & {
  group: GroupShowView
  user: UserReferenceView | null
}

export class IndexSerializer extends BaseSerializer<InformationSharingAgreementAccessGrant> {
  perform(): AccessGrantIndexView {
    const { user, group } = this.record
    if (isUndefined(user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(group)) {
      throw new Error("Expected group association to be preloaded")
    }

    let serializedUser = null
    if (!isNil(user)) {
      serializedUser = UserReferenceSerializer.perform(user)
    }

    const serializedGroup = GroupShowSerializer.perform(group)

    return {
      ...pick(this.record, [
        "id",
        "informationSharingAgreementId",
        "groupId",
        "userId",
        "accessLevel",
        "creatorId",
        "createdAt",
        "updatedAt",
      ]),
      user: serializedUser,
      group: serializedGroup,
    }
  }
}

export default IndexSerializer
