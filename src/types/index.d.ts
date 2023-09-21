import { UsersModel } from "../models/usersModel"
//index.d.ts
declare global {
   declare namespace Express {
        export interface Request {
            userId:  string | null
            user: UsersModel | null
        }
    }
}
