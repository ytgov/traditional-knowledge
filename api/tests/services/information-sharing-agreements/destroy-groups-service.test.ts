import { Group } from "@/models"

import { groupFactory, informationSharingAgreementFactory, userFactory } from "@/tests/factories"

import DestroyGroupsService from "@/services/information-sharing-agreements/destroy-groups-service"

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

describe("api/src/services/information-sharing-agreements/destroy-groups-service.ts", () => {
  describe("DestroyGroupsService", () => {
    describe("#perform", () => {
      test("when ISA has both groups, destroys both groups", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const internalGroup = await groupFactory.create({ isExternal: false })
        const externalGroup = await groupFactory.create({ isExternal: true })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: internalGroup.id,
          externalGroupId: externalGroup.id,
        })

        // Act
        await DestroyGroupsService.perform(informationSharingAgreement, currentUser)

        // Assert
        const groups = await Group.findAll()
        expect(groups).toHaveLength(0)
      })

      test("when externalGroupId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const internalGroup = await groupFactory.create({ isExternal: false })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: internalGroup.id,
          externalGroupId: null,
        })

        // Act & Assert
        await expect(
          DestroyGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("External group ID is required")
      })

      test("when internalGroupId is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalGroup = await groupFactory.create({ isExternal: true })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          internalGroupId: null,
          externalGroupId: externalGroup.id,
        })

        // Act & Assert
        await expect(
          DestroyGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Internal group ID is required")
      })
    })
  })
})
