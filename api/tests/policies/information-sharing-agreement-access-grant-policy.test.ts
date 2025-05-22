import { InformationSharingAgreementAccessGrant } from "@/models"
import InformationSharingAgreementAccessGrantPolicy from "@/policies/information-sharing-agreement-access-grant-policy"
import {
  informationSharingAgreementAccessGrantFactory,
  informationSharingAgreementFactory,
  userFactory,
} from "@/factories"

describe("api/src/policies/information-sharing-agreement-access-grant-policy.ts", () => {
  describe("InformationSharingAgreementAccessGrantPolicy", () => {
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
  })
})
