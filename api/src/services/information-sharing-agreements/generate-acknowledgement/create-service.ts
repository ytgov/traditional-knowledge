import { isUndefined } from "lodash"
import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"

import fs from "fs"
import path from "path"

import { TEMPLATE_ROOT_PATH } from "@/config"

import { InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"

export class CreateService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Buffer> {
    const { sharingGroupContact, receivingGroupContact } = this.informationSharingAgreement

    if (isUndefined(sharingGroupContact)) {
      throw new Error(
        "Expected information sharing agreement to have pre-loaded sharingGroupContact association"
      )
    }

    if (isUndefined(receivingGroupContact)) {
      throw new Error(
        "Expected information sharing agreement to have pre-loaded receivingGroupContact association"
      )
    }

    const templateData = this.buildTemplateData()
    const content = this.generateTemplate(templateData)

    return content
  }

  private generateTemplate(templateData: Record<string, string>) {
    const templatePath = path.resolve(
      __dirname,
      `${TEMPLATE_ROOT_PATH}/templates/information-sharing-agreements/acknowledgement-template.docx`
    )
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

  // TODO: move to serializer
  private buildTemplateData(): Record<string, string> {
    const { title } = this.informationSharingAgreement
    const templateData: Record<string, string> = {}

    // Basic Information
    templateData["title"] = title

    return templateData
  }
}

export default CreateService
