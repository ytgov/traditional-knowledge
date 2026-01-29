export default {
  informationSharingAgreement: {
    accessLevels: {
      internal: "INTERNAL",
      protected_and_limited: "PROTECTED and LIMITED",
      confidential_and_restricted: "CONFIDENTIAL and RESTRICTED",
    },
    accessLevelDescriptions: {
      internal:
        "INTERNAL to all YG employees across all departments. This Traditional Knowledge (TK) is not accessible to the public and has been shared for Yukon Government's (YG's) internal information only. Any YG employees who access this TK understand there could be negative impacts to intergovernmental relations if TK is made available to the public or unauthorised personnel.",
      protected_and_limited:
        "PROTECTED and LIMITED to employees from {department}. This Traditional Knowledge (TK) is sensitive and could damage intergovernmental relations, negatively impact Yukon Government's (YG's) reputation and/or legal position if TK is made available to the public or unauthorised personnel.",
      confidential_and_restricted:
        "CONFIDENTIAL and RESTRICTED to employees within {departmentBranchUnitHeirarchy}. This Traditional Knowledge (TK) is highly sensitive or sacred and could significantly damage intergovernmental relations, reputation(s), result in legal action or risk harm if TK is made available to the public or unauthorised personnel.",
      confidential_and_restricted_with_additional_restrictions:
        "CONFIDENTIAL and RESTRICTED to employees within {departmentBranchUnitHeirarchy}, with {additionalAccessRestrictions}. This Traditional Knowledge (TK) is highly sensitive or sacred and could significantly damage intergovernmental relations, reputation(s), result in legal action or risk harm if TK is made available to the public or unauthorised personnel.",
    },
    confidentiality: {
      ACCORDANCE: "ACCORDANCE",
      ACCEPTED_IN_CONFIDENCE: "ACCEPTED IN CONFIDENCE",
    },
    confidentialityDescriptions: {
      ACCORDANCE: "ACCORDANCE with the terms and conditions of this agreement.",
      ACCEPTED_IN_CONFIDENCE: "ACCEPTED IN CONFIDENCE which includes formal protection measures.",
    },
  },
  user: {
    roles: {
      user: "User",
      system_admin: "System Admin",
    },
  },
}
