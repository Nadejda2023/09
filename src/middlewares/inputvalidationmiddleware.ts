import {Response, Request, NextFunction } from "express";
import { validationResult } from 'express-validator';
import { sendStatus } from "../routers/sendStatus";



export const authorizationValidation = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if(!auth) return res.sendStatus(401)
    const [authType, authData] = auth.split(' ')
    if (authType !== 'Basic' || authData !=='YWRtaW46cXdlcnR5') return res.sendStatus(401)
    return next()

}

export const inputValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArray = errors.array({onlyFirstError: true})   
        const errorsMessages = errorsArray.map((e: any )=> ({message: e.msg, field: e.path}))
        
        res.status(sendStatus.BAD_REQUEST_400).json({ errorsMessages })
        return 
    } else {
        next()
    }
}
