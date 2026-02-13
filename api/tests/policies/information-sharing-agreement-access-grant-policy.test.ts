import { InformationSharingAgreementAccessGrant } from "@/models"

import {
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
        const user = await userFactory.create()

        const informationSharingAgreement = await informationSharingAgreementFactory.create()
        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: user.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.show()).toBe(true)
      })

      test("when the user does not have any level of access to the information sharing agreement, returns false", async () => {
        // Arrange
        const user = await userFactory.create()

        const otherUser = await userFactory.create()
        const informationSharingAgreement = await informationSharingAgreementFactory.create()
        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: otherUser.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.show()).toBe(false)
      })
    })

    describe("#create", () => {
      test("when the user has admin level access to the information sharing agreement, returns true", async () => {
        // Arrange
        const user = await userFactory.create()

        const informationSharingAgreement = await informationSharingAgreementFactory.create()

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: user.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.ADMIN,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.create()).toBe(true)
      })

      test("when the user does not have admin level access to the information sharing agreement, returns false", async () => {
        // Arrange
        const user = await userFactory.create()

        const informationSharingAgreement = await informationSharingAgreementFactory.create()

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: user.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.EDIT,
          })

        await informationSharingAgreementAccessGrant.reload({
          include: ["siblings"],
        })

        // Act
        const policy = new InformationSharingAgreementAccessGrantPolicy(
          user,
          informationSharingAgreementAccessGrant
        )

        // Assert
        expect(policy.create()).toBe(false)
      })
    })

    describe(".applyScope", () => {
      test("when the user has an access grant, returns all access grants for information sharing agreements the user has grants to", async () => {
        // Arrange
        const user = await userFactory.create()

        const informationSharingAgreement = await informationSharingAgreementFactory.create()

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: user.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        const ids = informationSharingAgreementAccessGrants.map((accessGrant) => accessGrant.id)
        expect(ids).toEqual([informationSharingAgreementAccessGrant.id])
      })

      test("when the user does not have an access grant, returns an empty array", async () => {
        // Arrange
        const user = await userFactory.create()

        const otherUser = await userFactory.create()
        const informationSharingAgreement = await informationSharingAgreementFactory.create()
        await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          userId: otherUser.id,
          accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
        })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        expect(informationSharingAgreementAccessGrants.length).toEqual(0)
      })

      test("when the user has an access grant, and other access grants to the same information sharing agreement, returns all access grants for the information sharing agreement", async () => {
        // Arrange
        const user = await userFactory.create()

        const informationSharingAgreement = await informationSharingAgreementFactory.create()

        const informationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: user.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
          })

        const otherUser = await userFactory.create()
        const otherInformationSharingAgreementAccessGrant =
          await informationSharingAgreementAccessGrantFactory.create({
            informationSharingAgreementId: informationSharingAgreement.id,
            userId: otherUser.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.EDIT,
          })

        // Act
        const policyScope = InformationSharingAgreementAccessGrantPolicy.applyScope([], user)
        const informationSharingAgreementAccessGrants = await policyScope.findAll()

        // Assert
        const ids = informationSharingAgreementAccessGrants.map((accessGrant) => accessGrant.id)
        expect(ids).toEqual([
          informationSharingAgreementAccessGrant.id,
          otherInformationSharingAgreementAccessGrant.id,
        ])
      })
    })
  })
})
