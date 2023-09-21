import { ObjectId } from "mongodb"

export type BlogsInputViewModel ={

    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogsViewModel ={
id: string,
name: string,
description: string,
websiteUrl: string,
createdAt: string,
isMembership: boolean,
}

export type BlogsViewDBModel ={
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    }

export type PaginatedBlog<T> = {
    pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: T[],
}