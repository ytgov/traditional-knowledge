import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

import { User } from "@/models"

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate(async (user) => {
    try {
      await user.save()
      return user
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create User with attributes: ${JSON.stringify(user.dataValues, null, 2)}`
      )
    }
  })

  const auth0Subject = faker.string.uuid()

  const fakeFirstName = faker.person.firstName()
  const firstName = `${fakeFirstName}-${sequence}`
  const fakeLastName = faker.person.lastName()
  const lastName = `${fakeLastName}-${sequence}`
  const email = faker.internet.email({ firstName, lastName })

  return User.build({
    auth0Subject,
    email,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    roles: [User.Roles.USER],
  })
})

export default userFactory
