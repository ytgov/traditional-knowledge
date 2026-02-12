import { DateTime } from "luxon"
import { vi } from "vitest"

import { Group } from "@/models"
import { CreateGroupsService } from "@/services/information-sharing-agreements/create-groups-service"

import { externalOrganizationFactory } from "@/factories/external-organization-factory"
import { informationSharingAgreementFactory } from "@/factories/information-sharing-agreement-factory"
import userFactory from "@/factories/user-factory"

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

describe("api/src/services/information-sharing-agreements/create-groups-service.ts", () => {
  describe("CreateGroupsService", () => {
    describe("#perform", () => {
      test("when both contacts exist with proper associations, creates groups with correct names", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const signedDate = DateTime.now().toFormat("yyyy-MM-dd")
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: DateTime.now().toJSDate(),
        })

        // Act
        await CreateGroupsService.perform(informationSharingAgreement, currentUser)

        // Assert
        const createdGroups = await Group.findAll({
          order: [["name", "ASC"]],
        })
        expect(createdGroups).toEqual([
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-Test Department-${signedDate}`,
          }),
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-Test External Organization-${signedDate}`,
          }),
        ])
      })

      test("when groups are created, assigns sharing group and receiving group IDs back to sharing agreement", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: DateTime.now().toJSDate(),
        })

        // Act
        await CreateGroupsService.perform(informationSharingAgreement, currentUser)

        // Assert
        const createdGroups = await Group.findAll()
        expect(informationSharingAgreement).toEqual(
          expect.objectContaining({
            sharingGroupId: createdGroups[0].id,
            receivingGroupId: createdGroups[1].id,
          })
        )
      })

      test("when sharing group contact ID is nil, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: null,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Sharing group contact ID must be present to create sharing group")
      })

      test("when receiving group contact ID is nil, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const informationSharingAgreement = informationSharingAgreementFactory.build({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: null,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Receiving group contact ID must be present to create receiving group")
      })

      test("when agreement is not signed, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: null,
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Signed date must be present to create groups")
      })

      test("when sharing group contact no longer exists, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await sharingGroupContact.destroy()
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Sharing group contact not found")
      })

      test("when sharing group contact is not external, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: false,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Sharing group contact must be an external user")
      })

      test("when sharing group contact's external organization no longer exists, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await externalOrganization.destroy()
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Sharing group contact is missing its associated external organization")
      })

      test("when receiving group contact no longer exists, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await receivingGroupContact.destroy()
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Receiving group contact not found")
      })

      test("when receiving group contact is external, errors informatively", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization1 = await externalOrganizationFactory.create()
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization1.id,
        })
        const externalOrganization2 = await externalOrganizationFactory.create()
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization2.id,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Receiving group contact must be an internal user")
      })

      test("when receiving group contact has no department, uses UNKNOWN", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const receivingGroupContact = await userFactory.create({
          department: null,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: DateTime.now().toJSDate(),
        })

        const signedDate = DateTime.now().toFormat("yyyy-MM-dd")

        // Act
        await CreateGroupsService.perform(informationSharingAgreement, currentUser)

        // Assert
        const createdGroups = await Group.findAll({
          order: [["name", "ASC"]],
        })
        expect(createdGroups).toEqual([
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-Test External Organization-${signedDate}`,
          }),
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-UNKNOWN-${signedDate}`,
          }),
        ])
      })

      test("when group names exceed maximum length, truncates correctly", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const longOrganizationName = "A".repeat(100)
        const externalOrganization = await externalOrganizationFactory.create({
          name: longOrganizationName,
        })
        const sharingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })

        const longDepartmentName = "B".repeat(100)
        const receivingGroupContact = await userFactory.create({
          department: longDepartmentName,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: DateTime.now().toJSDate(),
        })

        // Act
        await CreateGroupsService.perform(informationSharingAgreement, currentUser)

        // Assert
        const createdGroups = await Group.findAll({
          order: [["name", "ASC"]],
        })
        const signedDate = DateTime.now().toFormat("yyyy-MM-dd")

        expect(createdGroups).toEqual([
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-${signedDate}`,
          }),
          expect.objectContaining({
            name: `ISA#${informationSharingAgreement.id}-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-${signedDate}`,
          }),
        ])
      })
    })
  })
})
