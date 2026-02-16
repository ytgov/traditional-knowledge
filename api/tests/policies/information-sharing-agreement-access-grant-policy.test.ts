import { InformationSharingAgreementAccessGrant } from "@/models"

import {
  groupFactory,
  informationSharingAgreementAccessGrantFactory,
  informationSharingAgreementFactory,
  userFactory,
} from "@/tests/factories"

import InformationSharingAgreementAccessGrantPolicy from "@/policies/information-sharing-agreement-access-grant-policy"

describe("api/src/policies/information-sharing-agreement-access-grant-policy.ts", () => {
  describe("InformationSharingAgreementAccessGrantPolicy", () => {
    describe("#show", () => {
      test("when the user has any level of access to the information sharing agreement, returns true", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user1,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.show()).toBe(true)
      })

      test("when the user does not have any level of access to the information sharing agreement, returns false", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const user2 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user2.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user1,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.show()).toBe(false)
      })
    })

    describe("#create", () => {
      test("when the user has admin level access to the information sharing agreement, returns true", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.ADMIN,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user1,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.create()).toBe(true)
      })

      test("when the user does not have admin level access to the information sharing agreement, returns false", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.EDIT,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user1,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.create()).toBe(false)
      })
    })

    describe(".applyScope", () => {
      test("when the user has an access grant, returns all access grants for information sharing agreements the user has grants to", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user1)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        expect(informationSharingAgreementAccessGrants).toEqual([
          expect.objectContaining({
            id: informationSharingAgreementAccessGrant.id,
          }),
        ])
      })

      test("when the user does not have an access grant, returns an empty array", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const user2 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          groupId: group.id,
          userId: user2.id,
          accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
        })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user1)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        expect(informationSharingAgreementAccessGrants).toEqual([])
      })

      test("when the user has an access grant, and other access grants to the same information sharing agreement, returns all access grants for the information sharing agreement", async () => {
        // Arrange
        const user1 = await userFactory.create()
        const group = await groupFactory.create({
          isExternal: false,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        const informationSharingAgreementAccessGrant1 =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        const user2 = await userFactory.create()
        const informationSharingAgreementAccessGrant2 =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user2.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.EDIT,
          })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user1)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        expect(informationSharingAgreementAccessGrants).toEqual([
          expect.objectContaining({
            id: informationSharingAgreementAccessGrant1.id,
          }),
          expect.objectContaining({
            id: informationSharingAgreementAccessGrant2.id,
          }),
        ])
      })
    })
  })
})
