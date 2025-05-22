import { faker } from "@faker-js/faker"
import { Factory } from "fishery"
import { DateTime } from "luxon"

import { InformationSharingAgreement } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import userFactory from "@/factories/user-factory"
import groupFactory from "@/factories/group-factory"

export const informationSharingAgreementFactory = Factory.define<InformationSharingAgreement>(
  ({ sequence, associations, onCreate }) => {
    onCreate(async (agreement) => {
      try {
        await nestedSaveAndAssociateIfNew(agreement)
        return agreement
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create InformationSharingAgreement with attributes: ${JSON.stringify(agreement.dataValues, null, 2)}`
        )
      }
    })

    const creator =
      associations.creator ??
      userFactory.build({
        id: undefined,
      })

    const sharingGroup =
      associations.sharingGroup ??
      groupFactory.build({
        id: undefined,
      })

    const receivingGroup =
      associations.receivingGroup ??
      groupFactory.build({
        id: undefined,
        isHost: false,
      })

    const sharingGroupContact =
      associations.sharingGroupContact ??
      userFactory.build({
        id: undefined,
      })

    const receivingGroupContact =
      associations.receivingGroupContact ??
      userFactory.build({
        id: undefined,
      })

    const sentence = faker.lorem.sentence()
    const title = `${sentence}-${sequence}`
    const startDate = new Date()
    const endDate = DateTime.now().plus({ days: 90 }).toJSDate()

    const agreement = InformationSharingAgreement.build({
      title,
      startDate,
      endDate,
      sharingGroupId: sharingGroup.id,
      sharingGroupContactId: sharingGroupContact.id,
      receivingGroupId: receivingGroup.id,
      receivingGroupContactId: receivingGroupContact.id,
      creatorId: creator.id,
    })

    agreement.creator = creator
    agreement.sharingGroup = sharingGroup
    agreement.receivingGroup = receivingGroup
    agreement.sharingGroupContact = sharingGroupContact
    agreement.receivingGroupContact = receivingGroupContact

    return agreement
  }
)

export default informationSharingAgreementFactory
