import { User, InformationSharingAgreementAccessGrant } from "@/models"

import {
  groupFactory,
  informationSharingAgreementAccessGrantFactory,
  informationSharingAgreementFactory,
  userFactory,
} from "@/tests/factories"

import { mockCurrentUser, request } from "@/tests/support"

describe("api/src/controllers/information-sharing-agreement-access-grants-controller.ts", () => {
  describe("InformationSharingAgreementAccessGrantsController", () => {
    describe("#show", () => {
      let currentUser: User

      beforeEach(async () => {
        currentUser = await userFactory.create()
        mockCurrentUser(currentUser)
      })

      test("when including siblings association, does not trigger identifier overflow error", async () => {
        // Arrange
        const user2 = await userFactory.create()
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
            userId: currentUser.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.ADMIN,
          })

        await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          groupId: group.id,
          userId: user2.id,
          accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.READ,
        })

        // Act
        const response = await request().get(
          `/api/information-sharing-agreement-access-grants/${informationSharingAgreementAccessGrant1.id}`
        )

        // Assert
        expect(response.status).toBe(200)
      })

      test("when user has no access to access grant, returns 403", async () => {
        // Arrange
        const user2 = await userFactory.create()
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
            userId: user2.id,
            accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.ADMIN,
          })

        // Act
        const response = await request().get(
          `/api/information-sharing-agreement-access-grants/${informationSharingAgreementAccessGrant1.id}`
        )

        // Assert
        expect(response.status).toBe(403)
      })
    })
  })
})
