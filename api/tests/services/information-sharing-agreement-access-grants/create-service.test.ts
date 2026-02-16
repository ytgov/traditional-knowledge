import { UserGroup } from "@/models"

import { groupFactory, informationSharingAgreementFactory, userFactory } from "@/tests/factories"

import CreateService from "@/services/information-sharing-agreement-access-grants/create-service"

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

describe("api/src/services/information-sharing-agreement-access-grants/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when valid attributes, creates an access grant", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        // Act
        const accessGrant = await CreateService.perform(
          {
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
          },
          currentUser
        )

        // Assert
        expect(accessGrant).toEqual(
          expect.objectContaining({
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
            creatorId: currentUser.id,
          })
        )
      })

      test("when user is not in the group, auto-creates user group membership", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        // Act
        await CreateService.perform(
          {
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
          },
          currentUser
        )

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toEqual([
          expect.objectContaining({
            userId: user1.id,
            groupId: group.id,
          }),
        ])
      })

      test("when skipUserGroupCreation is true, does not create user group membership", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const user1 = await userFactory.create()
        const group = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: group.id,
        })

        // Act
        await CreateService.perform(
          {
            informationSharingAgreementId: informationSharingAgreement.id,
            groupId: group.id,
            userId: user1.id,
          },
          currentUser,
          {
            skipUserGroupCreation: true,
          }
        )

        // Assert
        const userGroups = await UserGroup.findAll()
        expect(userGroups).toHaveLength(0)
      })

      test("when informationSharingAgreementId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act & Assert
        await expect(
          CreateService.perform(
            {
              groupId: 1,
              userId: 1,
            },
            currentUser
          )
        ).rejects.toThrow("Information sharing agreement id is required")
      })

      test("when groupId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act & Assert
        await expect(
          CreateService.perform(
            {
              informationSharingAgreementId: 1,
              userId: 1,
            },
            currentUser
          )
        ).rejects.toThrow("Group id is required")
      })

      test("when userId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act & Assert
        await expect(
          CreateService.perform(
            {
              informationSharingAgreementId: 1,
              groupId: 1,
            },
            currentUser
          )
        ).rejects.toThrow("User id is required")
      })
    })
  })
})
