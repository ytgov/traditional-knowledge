import { YukonGovernmentEmployee } from "@/integrations/yukon-government-integration"
import BaseSerializer from "@/serializers/base-serializer"

export type YukonGovernmentEmployeeAsIndex = {
  email: string
  firstName: string
  lastName: string
  displayName: string
  department: string
  division: string | null
  branch: string | null
  unit: string | null
  title: string
}

export class IndexSerializer extends BaseSerializer<YukonGovernmentEmployee> {
  perform(): YukonGovernmentEmployeeAsIndex {
    return {
      email: this.record.email,
      firstName: this.record.first_name,
      lastName: this.record.last_name,
      displayName: this.record.full_name,
      department: this.record.department,
      division: this.record.division,
      branch: this.record.branch,
      unit: this.record.unit,
      title: this.record.title,
    }
  }
}

export default IndexSerializer
