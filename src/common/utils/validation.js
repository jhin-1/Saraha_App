import { BadRequestException } from "../utils/response/index.js";

export const validation = (schema)=>{
    return (req,res,next)=>{
        let { value , error } = schema.validate(req.body,{abortearly:false})
        console.log(error , 'from validation.js');
        
        if (error) { 
            throw BadRequestException({message: "validation error" , extra: error});
        }
        next();
    }
}