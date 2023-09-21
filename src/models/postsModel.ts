import { ObjectId } from "mongodb"

export type PostViewInputModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  }

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
  }

  export type PostViewDBModel = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
  }

  export type PaginatedPost<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[],
  }