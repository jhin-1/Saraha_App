import joi from "joi";

export const singupSchema = joi.object({
    username:joi.string().min(3).max(50).required(),
    email:joi.string().email().required(),
    password:joi.string().min(3).max(30).required()
})

export const loginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(3).max(30).required()
})

