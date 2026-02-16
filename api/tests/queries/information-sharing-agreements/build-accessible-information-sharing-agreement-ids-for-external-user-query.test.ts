import { Op } from "@sequelize/core"
import { describe, test, expect } from "vitest"

import { InformationSharingAgreement } from "@/models"

import {
  externalOrganizationFactory,
  groupFactory,
  informationSharingAgreementFactory,
  userFactory,
  userGroupFactory,
} from "@/tests/factories"

import buildAccessibleInformationSharingAgreementIdsForExternalUserQuery from "@/queries/information-sharing-agreements/build-accessible-information-sharing-agreement-ids-for-external-user-query"

describe("api/src/queries/information-sharing-agreements/build-accessible-information-sharing-agreement-ids-for-external-user-query.ts", () => {
  describe("buildAccessibleInformationSharingAgreementIdsForExternalUserQuery", () => {
    test("given user is external, returns own drafts and non-draft information sharing agreements where user is group member", async () => {
      // Arrange
      const externalOrganization = await externalOrganizationFactory.create()
      const externalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: externalOrganization.id,
      })
      const otherExternalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: (await externalOrganizationFactory.create()).id,
      })
      const externalGroup = await groupFactory.create({
        isExternal: true,
      })
      const otherExternalGroup = await groupFactory.create({
        isExternal: true,
      })

      await userGroupFactory.create({
        userId: externalUser.id,
        groupId: externalGroup.id,
      })

      const ownDraft = await informationSharingAgreementFactory.create({
        creatorId: externalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        externalGroupId: externalGroup.id,
        internalGroupId: externalGroup.id,
      })

      const signedInformationSharingAgreementWithMyGroup =
        await informationSharingAgreementFactory.create({
          creatorId: otherExternalUser.id,
          status: InformationSharingAgreement.Status.SIGNED,
          externalGroupId: externalGroup.id,
          internalGroupId: externalGroup.id,
        })

      const _signedInformationSharingAgreementWithOtherGroup =
        await informationSharingAgreementFactory.create({
          creatorId: otherExternalUser.id,
          status: InformationSharingAgreement.Status.SIGNED,
          externalGroupId: otherExternalGroup.id,
          internalGroupId: otherExternalGroup.id,
        })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForExternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: externalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([
        expect.objectContaining({
          id: ownDraft.id,
        }),
        expect.objectContaining({
          id: signedInformationSharingAgreementWithMyGroup.id,
        }),
      ])
    })

    test("give user is external, does not return information sharing agreements for other external groups", async () => {
      // Arrange
      const externalOrganization = await externalOrganizationFactory.create()
      const externalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: externalOrganization.id,
      })
      const otherExternalOrganization = await externalOrganizationFactory.create()
      const otherExternalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: otherExternalOrganization.id,
      })
      const externalGroup = await groupFactory.create({
        isExternal: true,
      })
      const otherExternalGroup = await groupFactory.create({
        isExternal: true,
      })

      await userGroupFactory.create({
        userId: externalUser.id,
        groupId: externalGroup.id,
      })

      await userGroupFactory.create({
        userId: otherExternalUser.id,
        groupId: otherExternalGroup.id,
      })

      const _signedInformationSharingAgreementWithOtherGroup =
        await informationSharingAgreementFactory.create({
          creatorId: otherExternalUser.id,
          status: InformationSharingAgreement.Status.SIGNED,
          externalGroupId: otherExternalGroup.id,
          internalGroupId: otherExternalGroup.id,
        })

      const _draftByOtherExternal = await informationSharingAgreementFactory.create({
        creatorId: otherExternalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        externalGroupId: otherExternalGroup.id,
        internalGroupId: otherExternalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForExternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: externalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([])
    })

    test("when external user has no groups, returns only own drafts", async () => {
      // Arrange
      const externalOrganization = await externalOrganizationFactory.create()
      const externalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: externalOrganization.id,
      })
      const otherExternalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: (await externalOrganizationFactory.create()).id,
      })
      const externalGroup = await groupFactory.create({
        isExternal: true,
      })

      const ownDraft = await informationSharingAgreementFactory.create({
        creatorId: externalUser.id,
        status: InformationSharingAgreement.Status.DRAFT,
        externalGroupId: externalGroup.id,
        internalGroupId: externalGroup.id,
      })

      const _signedInformationSharingAgreement = await informationSharingAgreementFactory.create({
        creatorId: otherExternalUser.id,
        status: InformationSharingAgreement.Status.SIGNED,
        externalGroupId: externalGroup.id,
        internalGroupId: externalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForExternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: externalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([expect.objectContaining({ id: ownDraft.id })])
    })

    test("when external user group is soft-deleted, excludes it from group membership check", async () => {
      // Arrange
      const externalOrganization = await externalOrganizationFactory.create()
      const externalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: externalOrganization.id,
      })
      const otherExternalUser = await userFactory.create({
        isExternal: true,
        externalOrganizationId: (await externalOrganizationFactory.create()).id,
      })
      const externalGroup = await groupFactory.create({
        isExternal: true,
      })

      const userGroup = await userGroupFactory.create({
        userId: externalUser.id,
        groupId: externalGroup.id,
      })
      await userGroup.destroy()

      const _signedInformationSharingAgreement = await informationSharingAgreementFactory.create({
        creatorId: otherExternalUser.id,
        status: InformationSharingAgreement.Status.SIGNED,
        externalGroupId: externalGroup.id,
        internalGroupId: externalGroup.id,
      })

      // Act
      const accessibleIdsQuery = buildAccessibleInformationSharingAgreementIdsForExternalUserQuery()
      const informationSharingAgreements = await InformationSharingAgreement.findAll({
        where: {
          id: {
            [Op.in]: accessibleIdsQuery,
          },
        },
        replacements: {
          userId: externalUser.id,
        },
      })

      // Assert
      expect(informationSharingAgreements).toEqual([])
    })
  })
})
