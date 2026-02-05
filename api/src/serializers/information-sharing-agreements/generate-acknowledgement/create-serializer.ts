import { isUndefined, truncate } from "lodash"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

export type InformationSharingAgreementAsAcknowledgement = {
  identifier: string
  "sharing_group_contact.display_name": string
  "sharing_group_contact.title": string
  "sharing_group_contact.email": string
  "sharing_group_contact.phone": string
  "receiving_group_contact.display_name": string
  "receiving_group_contact.title": string
  "receiving_group_contact.department": string
  "receiving_group_contact.branch": string
  "receiving_group_contact.phone": string
  "receiving_group_contact.email": string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    const { id, title, sharingGroupContact, receivingGroupContact } = this.record
    if (isUndefined(sharingGroupContact)) {
      throw new Error("Expected sharingGroupContact association to be preloaded")
    }

    if (isUndefined(receivingGroupContact)) {
      throw new Error("Expected receivingGroupContact association to be preloaded")
    }

    const identifier = this.buildIdentifier(id, title)
    return {
      identifier,
      "sharing_group_contact.display_name": sharingGroupContact.displayName,
      "sharing_group_contact.title": sharingGroupContact.title ?? "",
      "sharing_group_contact.email": sharingGroupContact.email,
      "sharing_group_contact.phone": sharingGroupContact.phoneNumber ?? "",
      "receiving_group_contact.display_name": receivingGroupContact.displayName,
      "receiving_group_contact.title": receivingGroupContact.title ?? "",
      "receiving_group_contact.department": receivingGroupContact.department ?? "",
      "receiving_group_contact.branch": receivingGroupContact.branch ?? "",
      "receiving_group_contact.phone": receivingGroupContact.phoneNumber ?? "",
      "receiving_group_contact.email": receivingGroupContact.email,
    }
  }

  private buildIdentifier(id: number, title: string): string {
    const suffix = ` - ISA#${id}`
    const titleMaxLength = IDENTIFIER_MAX_LENGTH - suffix.length
    const truncatedTitle = truncate(title, {
      length: titleMaxLength,
    })
    return `${truncatedTitle}${suffix}`
  }
}

export default CreateSerializer
