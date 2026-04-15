import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"

import fs from "fs"

import { TEMPLATE_ROOT_PATH } from "@/config"

import { InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import {
  CreateSerializer,
  type AsConfidentialityReceipt,
} from "@/serializers/information-sharing-agreements/generate-confidentiality-receipt"

export class CreateService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Buffer> {
    const templateData = this.buildTemplateData(this.informationSharingAgreement)
    const content = this.generateTemplate(templateData)
    return content
  }

  private generateTemplate(templateData: Record<string, string | boolean>): Buffer {
    const templatePath = `${TEMPLATE_ROOT_PATH}/information-sharing-agreements/confidentiality-receipt-template.docx`
    const templateContent = fs.readFileSync(templatePath, "binary")

    const templateZip = new PizZip(templateContent)

    const docxTemplater = new Docxtemplater(templateZip, {
      linebreaks: true,
      paragraphLoop: true,
    })

    docxTemplater.render(templateData)

    return docxTemplater.getZip().generate({
      type: "nodebuffer",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
  }

  private buildTemplateData(
    informationSharingAgreement: InformationSharingAgreement
  ): AsConfidentialityReceipt {
    return CreateSerializer.perform(informationSharingAgreement)
  }
}

export default CreateService
