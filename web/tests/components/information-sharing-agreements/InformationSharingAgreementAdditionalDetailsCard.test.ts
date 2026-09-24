import { describe, expect, it } from "vitest"
import { mount } from "@vue/test-utils"

import { mockVuetify } from "@/tests/support"

import InformationSharingAgreementAdditionalDetailsCard from "@/components/information-sharing-agreements/InformationSharingAgreementAdditionalDetailsCard.vue"

function mountCard(disclosureNotes: string | null) {
  return mount(InformationSharingAgreementAdditionalDetailsCard, {
    props: { disclosureNotes },
    global: {
      plugins: [mockVuetify()],
    },
  })
}

describe("InformationSharingAgreementAdditionalDetailsCard.vue", () => {
  it("renders the compelled disclosure notes", () => {
    const wrapper = mountCard("Notify the community before any compelled disclosure.")

    expect(wrapper.text()).toContain("Notify the community before any compelled disclosure.")
    expect(wrapper.text()).not.toContain("Not specified")
  })

  it("shows a placeholder when nothing is filled in", () => {
    const wrapper = mountCard(null)

    expect(wrapper.text()).toContain("Not specified")
  })
})
