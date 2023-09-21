import { db } from "../db/db"
//import { blogsRepository } from "./blogs-in-memory-repository"
 
type postsType = {
    id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string
}

 export type postsArrayType = Array<postsType>
 //let postsArray: postsArrayType = []

 export const postsRepository = {
    findPostById(id: string) {
        return db.posts.find((post: { id: string }) => post.id === id)
    },
 
    findAllPosts(): postsArrayType {
        return db.posts
    },
    /*createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const postById = blogsRepository.findBlogById(blogId)
        const newPost: postsType = {
            id: (db.posts.length +1).toString(),           
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: postById!.id,
            blogName: postById!.name
        }
        db.posts.push(newPost)
            return newPost
    },*/
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundPostById = db.posts.find((post: { id: string }) => post.id === id);
        if (foundPostById) {
            foundPostById.title = title
            foundPostById.shortDescription = shortDescription
            foundPostById.content = content
            foundPostById.blogId = blogId
            return true
            }
            return false
    },
    deletePost(id: string) {
        const foundPostById = db.posts.find((p: { id: string }) => p.id === id)
        if (foundPostById) {
            db.posts = db.posts.filter((p: any) => p !== foundPostById);
            return true;
        }
        return false;
    },
    deleteAllPosts() {
        db.posts.splice(0, db.posts.length)
    }
 }







