import { Group, UserGroup } from "@/models"

import { groupFactory, userFactory, userGroupFactory } from "@/tests/factories"

import DestroyService from "@/services/groups/destroy-service"

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

describe("api/src/services/groups/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe("#perform", () => {
      test("when group exists, destroys the group", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create()

        // Act
        await DestroyService.perform(group, currentUser)

        // Assert
        const groups = await Group.findAll()
        expect(groups).toHaveLength(0)
      })

      test("when group has user group memberships, destroys them as well", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create()
        await userGroupFactory.create({
          groupId: group.id,
        })

        // Act
        await DestroyService.perform(group, currentUser)

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(0)
      })
    })
  })
})
