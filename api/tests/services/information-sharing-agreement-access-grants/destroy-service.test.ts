import { InformationSharingAgreementAccessGrant, UserGroup } from "@/models"

import {
  groupFactory,
  informationSharingAgreementAccessGrantFactory,
  informationSharingAgreementFactory,
  userFactory,
  userGroupFactory,
} from "@/tests/factories"

import DestroyService from "@/services/information-sharing-agreement-access-grants/destroy-service"

vi.mock("@/mailers/groups/notify-user-of-removal-mailer", () => {
  const NotifyUserOfRemovalMailerMock = { perform: vi.fn() }
  return {
    NotifyUserOfRemovalMailer: NotifyUserOfRemovalMailerMock,
    default: NotifyUserOfRemovalMailerMock,
  }
})
vi.mock("@/mailers/groups/notify-admins-of-removed-user-mailer", () => {
  const NotifyAdminsOfRemovedUserMailerMock = { perform: vi.fn() }
  return {
    NotifyAdminsOfRemovedUserMailer: NotifyAdminsOfRemovedUserMailerMock,
    default: NotifyAdminsOfRemovedUserMailerMock,
  }
})
vi.mock("@/services/notifications/groups/notify-user-of-removal-service", () => {
  const NotifyUserOfRemovalServiceMock = { perform: vi.fn() }
  return {
    NotifyUserOfRemovalService: NotifyUserOfRemovalServiceMock,
    default: NotifyUserOfRemovalServiceMock,
  }
})
vi.mock("@/services/notifications/groups/notify-admins-of-removed-user-service", () => {
  const NotifyAdminsOfRemovedUserServiceMock = { perform: vi.fn() }
  return {
    NotifyAdminsOfRemovedUserService: NotifyAdminsOfRemovedUserServiceMock,
    default: NotifyAdminsOfRemovedUserServiceMock,
  }
})

describe("api/src/services/information-sharing-agreement-access-grants/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe("#perform", () => {
      test("when access grant exists, destroys the access grant", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })
        const accessGrant = await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          groupId: group.id,
          userId: currentUser.id,
        })

        // Act
        await DestroyService.perform(accessGrant, currentUser)

        // Assert
        const accessGrants = await InformationSharingAgreementAccessGrant.findAll()
        expect(accessGrants).toHaveLength(0)
      })

      test("when no remaining grants for user in group, removes user group membership", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })
        const accessGrant = await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          groupId: group.id,
          userId: user1.id,
        })
        await userGroupFactory.create({
          userId: user1.id,
          groupId: group.id,
        })

        // Act
        await DestroyService.perform(accessGrant, currentUser)

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(0)
      })

      test("when skipUserGroupRemoval is true, does not remove user group membership", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })
        const accessGrant = await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          groupId: group.id,
          userId: user1.id,
        })
        await userGroupFactory.create({
          userId: user1.id,
          groupId: group.id,
        })

        // Act
        await DestroyService.perform(accessGrant, currentUser, {
          skipUserGroupRemoval: true,
        })

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(1)
      })
    })
  })
})
