import http from "@/api/http-client"

import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type Category = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type CategoryWhereOptions = WhereOptions<Category,
  "name">

export type CategoryFiltersOptions = FiltersOptions<{
  search?: string | string[]
}>

export type CategoryQueryOptions = QueryOptions<CategoryWhereOptions, CategoryFiltersOptions>

export const categoriesApi = {
  async list(
    params: CategoryQueryOptions = {}
  ): Promise<{
    categories: Category[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/categories", {
      params,
    })
    return data
  },
  async get(categoryId: number): Promise<{
    category: Category
    policy: Policy
  }> {
    const { data } = await http.get(`/api/categories/${categoryId}`)
    return data
  },
  async create(attributes: Partial<Category>): Promise<{
    category: Category
  }> {
    const { data } = await http.post("/api/categories", attributes)
    return data
  },
  async update(
    categoryId: number,
    attributes: Partial<Category>
  ): Promise<{
    category: Category
  }> {
    const { data } = await http.patch(`/api/categories/${categoryId}`, attributes)
    return data
  },
  async delete(categoryId: number): Promise<void> {
    const { data } = await http.delete(`/api/categories/${categoryId}`)
    return data
  },
}

export default categoriesApi
