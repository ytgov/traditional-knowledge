import { Factory } from "fishery"

import { InformationSharingAgreementAccessGrant } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/tests/factories/helpers"
import userFactory from "@/tests/factories/user-factory"
import groupFactory from "@/tests/factories/group-factory"
import informationSharingAgreementFactory from "@/tests/factories/information-sharing-agreement-factory"

export const informationSharingAgreementAccessGrantFactory =
  Factory.define<InformationSharingAgreementAccessGrant>(({ associations, onCreate }) => {
    onCreate(async (accessGrant) => {
      try {
        await nestedSaveAndAssociateIfNew(accessGrant)
        return accessGrant
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create InformationSharingAgreementAccessGrant with attributes: ${JSON.stringify(accessGrant.dataValues, null, 2)}`
        )
      }
    })

    const informationSharingAgreement =
      associations.informationSharingAgreement ??
      informationSharingAgreementFactory.build({
        id: undefined,
      })

    const group =
      associations.group ??
      groupFactory.build({
        id: undefined,
      })

    const creator =
      associations.creator ??
      userFactory.build({
        id: undefined,
      })

    const accessGrant = InformationSharingAgreementAccessGrant.build({
      informationSharingAgreementId: informationSharingAgreement.id,
      groupId: group.id,
      creatorId: creator.id,
    })

    accessGrant.informationSharingAgreement = informationSharingAgreement
    accessGrant.group = group
    accessGrant.creator = creator

    return accessGrant
  })

export default informationSharingAgreementAccessGrantFactory
