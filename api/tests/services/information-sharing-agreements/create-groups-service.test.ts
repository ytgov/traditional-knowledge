import { DateTime } from "luxon"

import { Group } from "@/models"
import { CreateGroupsService } from "@/services/information-sharing-agreements/create-groups-service"

import { externalOrganizationFactory } from "@/factories/external-organization-factory"
import { informationSharingAgreementFactory } from "@/factories/information-sharing-agreement-factory"
import userFactory from "@/factories/user-factory"

describe("api/src/services/information-sharing-agreements/create-groups-service.ts", () => {
  describe("CreateGroupsService", () => {
    describe("#perform", () => {
      test("when both contacts exist with proper associations, creates groups with correct names", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
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

      test("when sharing group contact ID is nil, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: null,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Sharing group contact ID must be present to ensure groups")
      })

      test("when receiving group contact ID is nil, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create()
        const informationSharingAgreement = informationSharingAgreementFactory.build({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: null,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Receiving group contact ID must be present to ensure groups")
      })

      test("when sharing group contact no longer exists, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
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

      test("when receiving group contact no longer exists, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create()
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
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

      test("when receiving group contact missing external organization, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create()
        const receivingGroupContact = await userFactory.create({
          externalOrganizationId: null,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: new Date(),
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Receiving group contact is missing its associated external organization")
      })

      test("when agreement is not signed, throws error", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create({
          department: "Test Department",
        })
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
        })
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          sharingGroupContactId: sharingGroupContact.id,
          receivingGroupContactId: receivingGroupContact.id,
          signedAt: null,
        })

        // Act & Assert
        await expect(
          CreateGroupsService.perform(informationSharingAgreement, currentUser)
        ).rejects.toThrow("Signed date must be present to ensure groups")
      })

      test("when sharing group contact has no department, uses UNKNOWN", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const sharingGroupContact = await userFactory.create({
          department: null,
        })
        const externalOrganization = await externalOrganizationFactory.create({
          name: "Test External Organization",
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
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
        const longDepartmentName = "A".repeat(100)
        const sharingGroupContact = await userFactory.create({
          department: longDepartmentName,
        })

        const longOrganizationName = "B".repeat(100)
        const externalOrganization = await externalOrganizationFactory.create({
          name: longOrganizationName,
        })
        const receivingGroupContact = await userFactory.create({
          isExternal: true,
          externalOrganizationId: externalOrganization.id,
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
