import { UnAuthorizedException } from "../response/index.js";
import {env} from '../../../../config/index.js'
import jwt from 'jsonwebtoken';


export const auth =(req,res,next)=>{
    let {token} = req.headers;
    if(!token){
        return UnAuthorizedException("Invalid Token")
    }
    let decode = jwt.decode(token)
    let Signature = undefined;
    switch(decode.aud){
        case"Admin":
            Signature = env.ADMIN_SIGNATURE
            break;
        default:
            Signature = env.USER_SIGNATURE
            break;
    }
    let decodeData = jwt.verify(token,Signature)
    req.userId = decodeData.id
    next()
}