import joi from "joi";

export const singupSchema = joi.object({
    username:joi.string().min(3).max(50).required().messages({
        "string.min":"username must be at least 3 characters",
        "string.max":"username must be at most 50 characters"
    }),
    age: joi.number().min(18).max(50).required().messages({
        "number.min":"age must be at least 18", 
        "number.max": "age must be at most 50"
    }),
    email:joi.string().email().required(),
    password:joi.string().pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}/).required(),// add reqex password
    users:joi.array().items().required()
})

export const loginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(3).max(30).required()
})

