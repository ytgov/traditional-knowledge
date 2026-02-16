import { Op } from "@sequelize/core"
import { describe, test, expect } from "vitest"

import { InformationSharingAgreement } from "@/models"

import {
  groupFactory,
  informationSharingAgreementFactory,
  userFactory,
  userGroupFactory,
} from "@/tests/factories"

import buildAccessibleInformationSharingAgreementIdsForInternalUserQuery from "@/queries/information-sharing-agreements/build-accessible-information-sharing-agreement-ids-for-internal-user-query"

describe("api/src/queries/information-sharing-agreements/build-accessible-information-sharing-agreement-ids-for-internal-user-query.ts", () => {
  describe("buildAccessibleInformationSharingAgreementIdsForInternalUserQuery", () => {
    test("given user is internal, returns own draft information sharing agreement, and all information sharing agreements where user is group member", async () => {
      // Arrange
      const internalUser = await userFactory.create({
        isExternal: false,
      })
      const internalGroup = await groupFactory.create({
        isExternal: false,
      })
      await userGroupFactory.create({
        userId: internalUser.id,
        groupId: internalGroup.id,
      })

      const otherInternalUser = await userFactory.create({
        isExternal: false,
      })

      const ownDraft = await informationSharingAgreementFactory.create({
        creatorId: internalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        internalGroupId: internalGroup.id,
      })
      const withGroupMembership = await informationSharingAgreementFactory.create({
        creatorId: otherInternalUser.id,
        status: InformationSharingAgreement.Status.SIGNED,
        internalGroupId: internalGroup.id,
      })

      const _otherUserDraft = await informationSharingAgreementFactory.create({
        creatorId: otherInternalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        internalGroupId: internalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForInternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: internalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([
        expect.objectContaining({
          id: ownDraft.id,
        }),
        expect.objectContaining({
          id: withGroupMembership.id,
        }),
      ])
    })

    test("given user is internal, does not return other users' drafts", async () => {
      // Arrange
      const internalUser = await userFactory.create({
        isExternal: false,
      })
      const internalGroup = await groupFactory.create({
        isExternal: false,
      })
      await userGroupFactory.create({
        userId: internalUser.id,
        groupId: internalGroup.id,
      })

      const otherInternalUser = await userFactory.create({
        isExternal: false,
      })

      const _draftByOtherInternal = await informationSharingAgreementFactory.create({
        creatorId: otherInternalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        internalGroupId: internalGroup.id,
      })

      // Act
      const accessibleIds = buildAccessibleInformationSharingAgreementIdsForInternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: { [Op.in]: accessibleIds },
        },
        replacements: {
          userId: internalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([])
    })

    test("given internal user has no groups, returns only own drafts", async () => {
      // Arrange
      const internalUser = await userFactory.create({
        isExternal: false,
      })
      const internalGroup = await groupFactory.create({
        isExternal: false,
      })

      const ownDraft = await informationSharingAgreementFactory.create({
        creatorId: internalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        internalGroupId: internalGroup.id,
      })

      const _signedInformationSharingAgreement = await informationSharingAgreementFactory.create({
        creatorId: internalUser.id,
        status: InformationSharingAgreement.Status.SIGNED,
        internalGroupId: internalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForInternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: internalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([expect.objectContaining({ id: ownDraft.id })])
    })

    test("given internal user group is soft-deleted, excludes it from group membership check", async () => {
      // Arrange
      const internalUser = await userFactory.create({
        isExternal: false,
      })
      const internalGroup = await groupFactory.create({
        isExternal: false,
      })

      const userGroup = await userGroupFactory.create({
        userId: internalUser.id,
        groupId: internalGroup.id,
      })
      await userGroup.destroy()

      const _signedInformationSharingAgreement = await informationSharingAgreementFactory.create({
        creatorId: internalUser.id,
        status: InformationSharingAgreement.Status.SIGNED,
        internalGroupId: internalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForInternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: internalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([])
    })
  })
})
