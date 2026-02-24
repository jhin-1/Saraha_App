import jwt from 'jsonwebtoken';
import { env } from '../../../config/index.js';


export const generateToken = (user,host)=>{
    let Signature = undefined; // genrate secret_key for [admin or user]
    let audience = undefined; // for know if this token for user of admin 
    let RefreshSingature = undefined;
    switch(user.role){
        case"0": // 0 is admin 
            Signature = env.ADMIN_SIGNATURE
            RefreshSingature = env.ADMIIN_REFRESH_TOKEN
            audience = "Admin"
            break;

        default:
            Signature = env.USER_SIGNATURE
            RefreshSingature = env.USER_REFRESH_TOKEN
            audience = "User"
            break;
    }
    let accessToken = jwt.sign({id:user._id},Signature,{ 
                    expiresIn:"1d",
                    notBefore:"30s",
                    issuer:host,
                    audience
    }) // generate token with user id and secret keY

    let RefreshToken = jwt.sign({id:user._id},RefreshSingature,{
        expiresIn:"1y",
        issuer:host,
        audience
    })
    return {accessToken,RefreshToken}
}


export const decodeToken = (token)=>{
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
    return decodeData
}


export const decodeRefreshToken = (token)=>{
    let decode = jwt.decode(token)
    let RefreshSingature = undefined;
    switch(decode.aud){
        case"Admin":
            RefreshSingature = env.ADMIIN_REFRESH_TOKEN
            break;
        default:
            RefreshSingature = env.USER_REFRESH_TOKEN
            break;
    }
    let decodeData = jwt.verify(token,RefreshSingature)
    return decodeData
}