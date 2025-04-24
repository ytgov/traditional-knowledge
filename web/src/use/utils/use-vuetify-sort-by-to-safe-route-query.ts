import { isEmpty, isNil, isString } from "lodash"
import { Ref } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { type VDataTable } from "vuetify/lib/components/VDataTable/index.mjs"

export type SortItem = VDataTable["sortBy"][0]

/**
 * Must not conflict with web/src/use/utils/use-vuetify-sort-by-to-sequelize-safe-order.ts SEPARATOR.
 */
const SEPARATOR = "_"

export function useVuetifySortByToSafeRouteQuery(
  name: string,
  defaultValue?: SortItem[] | undefined
): Ref<SortItem[] | undefined> {
  function parse(newSortBy: string[] | string | undefined): SortItem[] | undefined {
    if (isNil(newSortBy) || isEmpty(newSortBy)) {
      return
    }

    if (isString(newSortBy)) {
      newSortBy = [newSortBy]
    }

    return newSortBy.map((entry) => {
      const [key, order] = entry.split(SEPARATOR)
      return { key, order } as SortItem
    })
  }

  function stringify(sortByValue: SortItem[] | undefined): string[] | undefined {
    if (isNil(sortByValue) || isEmpty(sortByValue)) {
      return
    }

    return sortByValue.map(({ key, order }) => `${key}${SEPARATOR}${order}`)
  }

  const defaultValueString = stringify(defaultValue)
  return useRouteQuery<string[] | undefined, SortItem[] | undefined>(name, defaultValueString, {
    transform: {
      get: parse,
      set: stringify,
    },
  })
}

export default useVuetifySortByToSafeRouteQuery
