

export type commentViewModel =
{
  
  
  id: string,
  content: string,
  postId: string,
  commentatorInfo: {
    userId: string
  userLogin: string
  }
  createdAt: string
  }

  export type commentDBViewModel =
{
  
  id: string,
  content: string,
  commentatorInfo: {
    userId: string
  userLogin: string
  }
  createdAt: string
  }



  export type PaginatedCommentViewModel<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[],
  }
  