import { UnAuthorizedException } from "../utils/response/index.js";
import { decodeToken } from "../index.js";
import {get} from '../../database/redis/redis.service.js';

export const auth =async(req,res,next)=>{
    let {authorization} = req.headers;
    if(!authorization){
        return UnAuthorizedException("Invalid Token")
    }
    const [flag,token] = authorization.split(' ')

    switch(flag){
        case"Basic":
            let data = Buffer.from(token, "base64").toString()
            let [email,password] = data.split(":")
            break;

        case"Bearer":
            let decodeData = decodeToken(token) // funcation to decode the data { id:'69ae1079fe08c9016714dfa2',iat: 1773273517,nbf: 1773273547,exp: 1773359917,aud:'User',iss: 'http://localhost:3000'}
            
            // if user is logged out send unauthorized
            let revoked = await get(`revokeToken:${decodeData.id}::${token}`)
            if(revoked){
                return UnAuthorizedException({message:"already logged out"})
            }

            req.userId = decodeData.id // userid from token
            req.token = token // token itself
            req.decode = decodeData // {id:"",aud:"",iat:"",exp:""}
            next()
    }
}