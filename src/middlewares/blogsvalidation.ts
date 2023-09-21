import { body } from "express-validator";
import { inputValidationErrors } from "./inputvalidationmiddleware";


const nameValidation = body('name')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 1, max: 15})
                                            .withMessage('Length must be from 1 to 15 simbols')

const descriptionValidation = body('description')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 1, max: 500})
                                            .withMessage('Length must be from 1 to 500 simbols')

const websiteURLValidation = body('websiteUrl')
                                            .isString()
                                            .withMessage('Must be string')
                                            .isURL({})
                                            .withMessage('Must be a Url')



export const CreateBlogValidation = [nameValidation, descriptionValidation, websiteURLValidation, inputValidationErrors]
export const UpdateBlogValidation = [nameValidation, descriptionValidation, websiteURLValidation, inputValidationErrors]