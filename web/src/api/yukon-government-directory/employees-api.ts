import http from "@/api/http-client"

/** Keep in sync with api/src/serializers/yukon-government-directory/employees/index-serializer.ts */
export type YukonGovernmentEmployee = {
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

/** Keep in sync with API response structure */
export type YukonGovernmentEmployeeAsIndex = YukonGovernmentEmployee

export type YukonGovernmentEmployeeAsShow = YukonGovernmentEmployee

export type YukonGovernmentEmployeeWhereOptions = {
  email: string
}

export type YukonGovernmentEmployeeQueryOptions = {
  where?: YukonGovernmentEmployeeWhereOptions
}

export const employeesApi = {
  async list(params: YukonGovernmentEmployeeQueryOptions = {}): Promise<{
    employees: YukonGovernmentEmployeeAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/yukon-government-directory/employees", {
      params,
    })
    return data
  },
}

export default employeesApi
