import { Ref } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { type VDataTable } from "vuetify/lib/components/VDataTable/index.mjs"

import { jsonTransformer } from "@/utils/use-route-query-transformers"

export type SortItem = VDataTable["sortBy"][0]

export function useVuetifySortByToSafeRouteQuery(
  name: string,
  defaultValue?: SortItem[] | undefined
): Ref<SortItem[] | undefined> {
  const defaultValueString = jsonTransformer.set(defaultValue)
  return useRouteQuery<string | undefined, SortItem[] | undefined>(name, defaultValueString, {
    transform: jsonTransformer,
  })
}

export default useVuetifySortByToSafeRouteQuery
