import { UserGroup, InformationSharingAgreementAccessGrant } from "@/models"

import {
  groupFactory,
  informationSharingAgreementAccessGrantFactory,
  informationSharingAgreementFactory,
  userFactory,
  userGroupFactory,
} from "@/tests/factories"

import DestroyService from "@/services/user-groups/destroy-service"

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

describe("api/src/services/user-groups/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe("#perform", () => {
      test("when user group exists with preloaded associations, destroys the user group", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const userGroup = await userGroupFactory.create()
        await userGroup.reload({ include: ["user", "group"] })

        // Act
        await DestroyService.perform(userGroup, currentUser)

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(0)
      })

      test("when user group has access grants, removes access grants as well", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const user1 = await userFactory.create()
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })
        const userGroup = await userGroupFactory.create({
          userId: user1.id,
          groupId: group.id,
        })
        await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          userId: user1.id,
          groupId: group.id,
        })
        await userGroup.reload({ include: ["user", "group"] })

        // Act
        await DestroyService.perform(userGroup, currentUser)

        // Assert
        const accessGrants = await InformationSharingAgreementAccessGrant.findAll()
        expect(accessGrants).toHaveLength(0)
      })

      test("when skipAccessGrantRemoval is true, does not remove access grants", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const user1 = await userFactory.create()
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })
        const userGroup = await userGroupFactory.create({
          userId: user1.id,
          groupId: group.id,
        })
        await informationSharingAgreementAccessGrantFactory.create({
          informationSharingAgreementId: informationSharingAgreement.id,
          userId: user1.id,
          groupId: group.id,
        })
        await userGroup.reload({ include: ["user", "group"] })

        // Act
        await DestroyService.perform(userGroup, currentUser, {
          skipAccessGrantRemoval: true,
        })

        // Assert
        const accessGrants = await InformationSharingAgreementAccessGrant.findAll()
        expect(accessGrants).toHaveLength(1)
      })

      test("when user group exists with preloaded associations and no access grants, destroys cleanly", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const user1 = await userFactory.create()
        const userGroup = await userGroupFactory.create({
          userId: user1.id,
          groupId: group.id,
        })
        await userGroup.reload({ include: ["user", "group"] })

        // Act
        await DestroyService.perform(userGroup, currentUser)

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(0)
      })
    })
  })
})
