import { UnAuthorizedException } from "../response/index.js";
import jwt from 'jsonwebtoken';
import { decodeToken } from "../../index.js";



export const auth =(req,res,next)=>{
    let {authorization} = req.headers;
    if(!authorization){
        return UnAuthorizedException("Invalid Token")
    }
    const [flag,token] = authorization.split(' ')
    switch(flag){
        case"Basic":
            let data = Buffer.from(token, "base64").toString()
            console.log(data,"from data")
            let [email,password] = data.split(":")
            console.log(email,"  ",password)
            break;
        case"Bearer":
            let decodeData = decodeToken(token) // funcation to decode the data 
            req.userId = decodeData.id
            next()
    }
    
    
}