import fs from "fs"
import path from "path"
import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"

import { InformationSharingAgreement } from "@/models"
import BaseService from "@/services/base-service"
import { formatDate } from "@/utils/formatters"

export class DocumentGeneratorService extends BaseService {
  constructor(private informationSharingAgreement: InformationSharingAgreement) {
    super()
  }

  async perform(): Promise<Buffer> {
    // Load the template
    const templatePath = path.resolve(__dirname, "../../templates/ISA_Template.docx")
    const content = fs.readFileSync(templatePath, "binary")

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    // Prepare the data for template
    const data = this.prepareTemplateData()

    // Render the document
    doc.render(data)

    // Generate the buffer
    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    })

    return buffer
  }

  private prepareTemplateData() {
    const isa = this.informationSharingAgreement

    return {
      // Basic Information
      title: isa.title || "",
      identifier: isa.identifier || "",
      description: isa.description || "",
      purpose: isa.purpose || "",

      // Dates
      startDate: formatDate(isa.startDate),
      endDate: formatDate(isa.endDate),

      // Sharing Group
      hasSharingGroup: !!isa.sharingGroupId,
      sharingGroupInfo: isa.sharingGroupInfo || "",
      sharingGroupContactName: isa.sharingGroupContactName || "",
      sharingGroupContactTitle: isa.sharingGroupContactTitle || "",
      sharingGroupSignedBy: isa.sharingGroupSignedBy || "",
      sharingGroupSignedDate: isa.sharingGroupSignedDate
        ? formatDate(isa.sharingGroupSignedDate)
        : "",

      // Receiving Group
      hasReceivingGroup: !!isa.receivingGroupId,
      receivingGroupInfo: isa.receivingGroupInfo || "",
      receivingGroupContactName: isa.receivingGroupContactName || "",
      receivingGroupContactTitle: isa.receivingGroupContactTitle || "",
      receivingGroupSignedBy: isa.receivingGroupSignedBy || "",
      receivingGroupSignedDate: isa.receivingGroupSignedDate
        ? formatDate(isa.receivingGroupSignedDate)
        : "",

      // Information Details
      detailLevel: isa.detailLevel || "",
      detailNotes: isa.detailNotes || "",
      formats: isa.formats || "",

      // Access & Confidentiality
      accessLevels: isa.accessLevels || "",
      accessNotes: isa.accessNotes || "",
      confidentiality: isa.confidentiality || "",
      authorizedApplication: isa.authorizedApplication || "",

      // Credit & Attribution
      creditLines: isa.creditLines || "",
      creditNotes: isa.creditNotes || "",

      // Terms & Conditions
      expirationActions: isa.expirationActions || "",
      expirationNotes: isa.expirationNotes || "",
      breachActions: isa.breachActions || "",
      breachNotes: isa.breachNotes || "",
      disclosureNotes: isa.disclosureNotes || "",
    }
  }
}

export default DocumentGeneratorService
