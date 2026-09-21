import { describe, test, expect } from "vitest"

import { InformationSharingAgreement } from "@/models"
import { informationSharingAgreementFactory } from "@/tests/factories"

import CreateSerializer from "@/serializers/information-sharing-agreements/generate-confidentiality-acknowledgement/create-serializer"

describe("api/src/serializers/information-sharing-agreements/generate-confidentiality-acknowledgement/create-serializer.ts", () => {
  describe("CreateSerializer", () => {
    describe("#perform", () => {
      // Regression test for TK-39: a draft with unset contacts used to throw a TypeError,
      // which produced a truncated, unopenable .docx download.
      test("when contact associations are null, serializes with placeholders instead of throwing", async () => {
        // Arrange
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          status: InformationSharingAgreement.Status.DRAFT,
          externalGroupContactId: null,
          internalGroupContactId: null,
          internalGroupSecondaryContactId: null,
        })
        const reloaded = await InformationSharingAgreement.findByPk(
          informationSharingAgreement.id,
          {
            include: [
              {
                association: "externalGroupContact",
                include: ["externalOrganization"],
              },
              "internalGroupContact",
              "internalGroupSecondaryContact",
            ],
          }
        )
        if (reloaded === null) {
          throw new Error("Expected information sharing agreement to be found")
        }

        // Act
        const result = new CreateSerializer(reloaded).perform()

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            "external_group_contact.external_organization.name": "Not specified",
            "external_group_contact.display_name": "Not specified",
            "external_group_contact.email": "",
            "internal_group_contact.display_name": "Not specified",
            "internal_group_contact.email": "",
            "internal_group_secondary_contact.name_and_title": "Not specified",
            "internal_group_secondary_contact.email": "",
          })
        )
      })

      // Compelled disclosure is the one optional section in the ISA template. See TK-92.
      test("when disclosure notes are set, includes them", async () => {
        // Arrange
        const informationSharingAgreement = await informationSharingAgreementFactory.create({
          status: InformationSharingAgreement.Status.DRAFT,
          disclosureNotes: "Notify the Council first",
        })

        // Act
        const result = new CreateSerializer(informationSharingAgreement).perform()

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            disclosure_notes: "Notify the Council first",
          })
        )
      })
    })
  })
})
