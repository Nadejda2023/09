import { WithId } from "mongodb"
import { commentCollection, postsCollection } from "../db/db"
import { TPagination } from "../hellpers/pagination"
import { PaginatedCommentViewModel, commentDBViewModel, commentViewModel } from "../models/commentModels"




export const commentQueryRepository = {
    async getAllCommentsForPost(postId:string, pagination:TPagination): // postId:string
    Promise<PaginatedCommentViewModel<commentDBViewModel>> {
        //const filter = {name: { $regex :pagination.searchNameTerm, $options: 'i'}}
        const result : WithId<WithId<commentDBViewModel>>[] = await commentCollection.find({postId: postId}, {projection: {_id: 0, postId: 0}}) //filter
    
    .sort({[pagination.sortBy]: pagination.sortDirection})
    .skip(pagination.skip)
    .limit(pagination.pageSize)
    .toArray()
        const totalCount: number = await commentCollection.countDocuments({postId})
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


        const response: PaginatedCommentViewModel<commentDBViewModel> = {
        pagesCount: pageCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: result
        }
        return response
    },
   
    
    async findCommentById(commentId: string): Promise<commentDBViewModel | null> {
        return commentCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})

    },


    async deleteAllComment(): Promise<boolean> {
        const result = await commentCollection.deleteMany({})
      
        return result.acknowledged  === true
    
        
    },

    async updateComment(commentId: string, content: string ) : Promise<commentDBViewModel | undefined | boolean> {
        let foundComment = await commentCollection.findOne({id: commentId})
        if(foundComment){
        const result = await commentCollection.updateOne({id: commentId},{ $set:{content: content}}) //comentatorInfo: comentatorInfo
        return result.matchedCount === 1
        }
    },
    async deleteComment(commentId: string){
    const result = await commentCollection.deleteOne({id: commentId})
    return  result.deletedCount === 1
 }
}