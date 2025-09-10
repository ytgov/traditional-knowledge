import db from "@/db/db-client"

// Models
import ArchiveItem from "@/models/archive-item"
import ArchiveItemAudit from "@/models/archive-item-audit"
import ArchiveItemCategory from "@/models/archive-item-category"
import ArchiveItemFile from "@/models/archive-item-file"
import ArchiveItemInformationSharingAgreementAccessGrant from "@/models/archive-item-information-sharing-agreement-access-grant"
import Category from "@/models/category"
import Group from "@/models/group"
import InformationSharingAgreement from "@/models/information-sharing-agreement"
import InformationSharingAgreementAccessGrant from "@/models/information-sharing-agreement-access-grant"
import InformationSharingAgreementAccessGrantSibling from "@/models/information-sharing-agreement-access-grant-sibling"
import InformationSharingAgreementArchiveItem from "@/models/information-sharing-agreement-archive-item"
import Notification from "@/models/notification"
import Retention from "@/models/retention"
import User from "@/models/user"
import UserGroup from "@/models/user-group"

db.addModels([
  ArchiveItem,
  ArchiveItemAudit,
  ArchiveItemCategory,
  ArchiveItemFile,
  ArchiveItemInformationSharingAgreementAccessGrant,
  Category,
  Group,
  InformationSharingAgreement,
  InformationSharingAgreementAccessGrant,
  InformationSharingAgreementAccessGrantSibling,
  InformationSharingAgreementArchiveItem,
  Notification,
  Retention,
  User,
  UserGroup,
])

// Lazy load scopes
ArchiveItem.establishScopes()
ArchiveItemAudit.establishScopes()
ArchiveItemCategory.establishScopes()
ArchiveItemFile.establishScopes()
Category.establishScopes()
Group.establishScopes()
InformationSharingAgreement.establishScopes()
InformationSharingAgreementAccessGrant.establishScopes()
InformationSharingAgreementArchiveItem.establishScopes()
Notification.establishScopes()
Retention.establishScopes()
User.establishScopes()
UserGroup.establishScopes()

export {
  ArchiveItem,
  ArchiveItemAudit,
  ArchiveItemCategory,
  ArchiveItemFile,
  ArchiveItemInformationSharingAgreementAccessGrant,
  Category,
  Group,
  InformationSharingAgreement,
  InformationSharingAgreementAccessGrant,
  InformationSharingAgreementAccessGrantSibling,
  InformationSharingAgreementArchiveItem,
  Notification,
  Retention,
  User,
  UserGroup,
}

// Special db instance will all models loaded
export default db
