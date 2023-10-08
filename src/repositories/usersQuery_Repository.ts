import { WithId } from "mongodb"
import { usersCollection } from "../db/db"
import { TPagination, TUsersPagination } from "../hellpers/pagination"
import { PaginatedUser, UsersInputModel, UsersModel } from "../models/usersModel"
import { log } from "console"


// for get 1
export const usersQueryRepository = {
    async findUsers(pagination: TUsersPagination):
    Promise<PaginatedUser<UsersModel>> {
       const filter = {$or: [{email: { $regex: pagination.searchEmailTerm, $options: 'i'}}, {login: { $regex: pagination.searchLoginTerm, $options: 'i'}}]} 
       const result = await usersCollection.find(filter, {projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation: 0}})
   
   .sort({[pagination.sortBy]: pagination.sortDirection})
   .skip(pagination.skip)
   .limit(pagination.pageSize)
   .toArray()

   log(result)
       const totalCount: number = await usersCollection.countDocuments(filter)
       const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


   return {
       pagesCount: pageCount,
       page: pagination.pageNumber,
       pageSize: pagination.pageSize,
       totalCount: totalCount,
       items: result
       }
   },


async createUser(users: UsersModel) {
    await usersCollection.insertOne(users)
},
async findUserById(id: string): Promise<UsersModel | null> {
    let foundedUser = await usersCollection.findOne({id: id},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation: 0, refreshTokenBlackList: 0}})
    if (!foundedUser) {
        return null
    } return foundedUser;
},

async findByLoginOrEmail(loginOrEmail: string) {
    const user = await usersCollection.findOne({ $or: [{ email: loginOrEmail}, { login: loginOrEmail}]})
    return user
}, 
async findTokenInBL(userId: string, token: string):Promise<boolean>{
    const userByToken = await usersCollection.findOne({id: userId, refreshTokenBlackList: {$in: [token]}})
    return !!userByToken;
},
async findUserByToken(refreshToken:string):Promise<UsersModel | null>{
    const foundedUser = await usersCollection.findOne({refreshToken: refreshToken},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation: 0, refreshTokenBlackList: 0}})
    return foundedUser
},
}