import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { getPaginationFromQuery , getUsersPagination } from "../hellpers/pagination";
import { usersQueryRepository } from "../repositories/usersQuery_Repository";
import { authorizationValidation, inputValidationErrors } from "../middlewares/inputvalidationmiddleware";
import { PaginatedUser, UsersInputModel, UsersModel } from "../models/usersModel";
import { UsersInputValidation } from "../middlewares/usersvalidation";


export const usersRouter = Router({})
// users 1
usersRouter.get ( '/', 
async (req: Request, res: Response) : Promise<void> => {
    const pagination = getUsersPagination(req.query)
    const foundAllUsers: PaginatedUser<UsersModel> = await usersQueryRepository.findUsers(pagination)
res.status(200).send(foundAllUsers)
 })

usersRouter.post ( '/', 
authorizationValidation,
UsersInputValidation,
async (req: Request, res: Response) => {
    //const { login, email, password} = req.body
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    console.log(newUser)
    if(!newUser) {
        res.sendStatus(401)
    } else {
        res.status(201).send(newUser)
    }

})

usersRouter.delete('/:id',
authorizationValidation,
//to do errorsvalidation
async ( req: Request, res: Response) => {
    const isDeleted = await usersService.deleteUserById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204);
    }else {
        res.sendStatus(404);
    }
    }

)