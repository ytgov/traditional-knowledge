import { Knex } from "knex"
import { isNil } from "lodash"

import { ExternalOrganization } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const externalOrganizationsCount = await ExternalOrganization.count()
  if (externalOrganizationsCount > 0) return

  // Information from https://yukon.ca/en/your-government/about-yukon/find-out-about-yukon-first-nations
  const yukonFirstNations = [
    "Carcross/Tagish First Nation",
    "Champagne and Aishihik First Nations",
    "First Nation of Na-Cho Nyäk Dun",
    "Kluane First Nation",
    "Kwanlin Dün First Nation",
    "Liard First Nation",
    "Little Salmon/Carmacks First Nation",
    "Ross River Dena Council",
    "Selkirk First Nation",
    "Ta'an Kwäch'än Council",
    "Teslin Tlingit Council",
    "Tr'ondëk Hwëch'in",
    "Vuntut Gwitchin First Nation",
    "White River First Nation",
  ]

  for (const name of yukonFirstNations) {
    let organization = await ExternalOrganization.findOne({
      where: {
        name,
      },
    })
    if (isNil(organization)) {
      organization = await ExternalOrganization.create({
        name,
      })
    } else {
      // no-op, until we are seeding more data
      // await organization.update({ name })
    }
  }
}
