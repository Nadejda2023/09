import { body } from "express-validator";
import { inputValidationErrors } from "./inputvalidationmiddleware";
import { usersTwoRepository } from "../repositories/usersRepository";


const loginValidation = body('login')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 3, max: 10})
                                            .withMessage('Length must be from 3 to 10 simbols')
                                            .custom(async (login) => {

                                                const user = await usersTwoRepository.findByLoginU(login);

                                                if(user){
                                                    throw new Error("User with this login uzhe founded ")
                                                    }
                                                    return true
                                                
                                                
                                            })
const loginOrEmailV = body('loginOrEmail')
                                                .isString().trim().isLength({min:3, max: 30}).withMessage('Length must be from 3 to 10 simbols')                                         

const passwordVal= body('password')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 6, max: 20})
                                            .withMessage('Length must be from 6 to 20 simbols')


export const emailValidationCustom = body('email')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .isEmail()
                                            .withMessage('Must be  Email')
                                        
                                            .custom(async (email) => {
                                                const user = await usersTwoRepository.findUserByEmail(email);
                                                if(user){
                                                    throw new Error("User with this mail uzhe founded")
                                                }
                                                return true
                                             }) 

export const emailValidation2 = body('email')
                                             .isString()
                                             .withMessage('Must be string')
                                             .trim()
                                             //.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
                                             .custom(async (email) => {
                                                 const user = await usersTwoRepository.findUserByEmail(email);
                                                 if(!user){
                                                     throw new Error("User with this mail not founded")
                                                 }
                                                 return true
                                              })                                             


 const codeValidation = body('code')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                           
                                                                                     
                                            

                                            
export const regEmailValidationPost = [emailValidationCustom, inputValidationErrors ]                                            
export const registrationComfiValidation = [codeValidation, inputValidationErrors]

export const emailConfiResValidation = [emailValidation2, inputValidationErrors] 
export const UsersInputValidation = [loginValidation, passwordVal ,emailValidationCustom, inputValidationErrors]
export const loginOrEmailValidation = [loginOrEmailV, passwordVal, inputValidationErrors]