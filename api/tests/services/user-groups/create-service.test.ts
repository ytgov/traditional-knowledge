import { InformationSharingAgreementAccessGrant } from "@/models"

import { groupFactory, informationSharingAgreementFactory, userFactory } from "@/tests/factories"

import CreateService from "@/services/user-groups/create-service"

vi.mock("@/mailers/groups/notify-user-of-membership-mailer", () => {
  const NotifyUserOfMembershipMailerMock = { perform: vi.fn() }
  return {
    NotifyUserOfMembershipMailer: NotifyUserOfMembershipMailerMock,
    default: NotifyUserOfMembershipMailerMock,
  }
})
vi.mock("@/mailers/groups/notify-admins-of-added-user-mailer", () => {
  const NotifyAdminsOfAddedUserMailerMock = { perform: vi.fn() }
  return {
    NotifyAdminsOfAddedUserMailer: NotifyAdminsOfAddedUserMailerMock,
    default: NotifyAdminsOfAddedUserMailerMock,
  }
})
vi.mock("@/services/notifications/groups/notify-user-of-membership-service", () => {
  const NotifyUserOfMembershipServiceMock = { perform: vi.fn() }
  return {
    NotifyUserOfMembershipService: NotifyUserOfMembershipServiceMock,
    default: NotifyUserOfMembershipServiceMock,
  }
})
vi.mock("@/services/notifications/groups/notify-admins-of-added-user-service", () => {
  const NotifyAdminsOfAddedUserServiceMock = { perform: vi.fn() }
  return {
    NotifyAdminsOfAddedUserService: NotifyAdminsOfAddedUserServiceMock,
    default: NotifyAdminsOfAddedUserServiceMock,
  }
})

describe("api/src/services/user-groups/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when valid attributes provided, creates a user group membership", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create()

        // Act
        const userGroup = await CreateService.perform(
          { userId: user1.id, groupId: group.id },
          currentUser
        )

        // Assert
        expect(userGroup).toEqual(
          expect.objectContaining({
            userId: user1.id,
            groupId: group.id,
            creatorId: currentUser.id,
          })
        )
      })

      test("when userId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const group = await groupFactory.create()

        // Act & Assert
        await expect(
          CreateService.perform(
            {
              groupId: group.id,
            },
            currentUser
          )
        ).rejects.toThrow("User ID is required")
      })

      test("when groupId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()

        // Act & Assert
        await expect(
          CreateService.perform(
            {
              userId: user1.id,
            },
            currentUser
          )
        ).rejects.toThrow("Group ID is required")
      })

      test("when group is linked to an information sharing agreement, auto-creates access grants", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        // Act
        await CreateService.perform(
          {
            userId: user1.id,
            groupId: group.id,
          },
          currentUser
        )

        // Assert
        const accessGrants = await InformationSharingAgreementAccessGrant.findAll()
        expect(accessGrants).toEqual([
          expect.objectContaining({
            userId: user1.id,
            groupId: group.id,
          }),
        ])
      })

      test("when skipAccessGrantCreation is true, does not create access grants", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        // Act
        await CreateService.perform(
          {
            userId: user1.id,
            groupId: group.id,
          },
          currentUser,
          {
            skipAccessGrantCreation: true,
          }
        )

        // Assert
        const accessGrants = await InformationSharingAgreementAccessGrant.findAll()
        expect(accessGrants).toHaveLength(0)
      })
    })
  })
})
