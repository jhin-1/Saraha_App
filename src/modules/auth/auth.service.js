import { generateToken, ProviderEnums } from '../../common/index.js';
import { BadRequestException, ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import {UserModel} from '../../database/index.js';
import { hashPassword, comparePassword,decodeRefreshToken } from '../../common/index.js';
import { env } from '../../../config/index.js';
import jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library'; 



export const singup = async(data)=>{
    let {userName,email,password} = data;
    let userexist = await UserModel.findOne({email});
    if(userexist){
        return ConflictException({message:"email already exist"});
    }
    let hashpassword = await hashPassword(password);
    let user = await UserModel.create({userName,email,password:hashpassword});
    return user;

}

export const login = async(data,host)=>{
    // destarct the Data from the object prameter 
    let {email,password} = data;
    // get user by email
    let userexist = await UserModel.findOne({email, provider:ProviderEnums.System}).select(" -__v");
    if(userexist){
        const isMatch = await comparePassword(password,userexist.password);
        if(isMatch){
            let {accessToken,RefreshToken} = generateToken(userexist,host)
            console.log(RefreshToken)
            return {accessToken,RefreshToken,user:userexist};
        }
    }
    return UnAuthorizedException({message:"Unauthorized"})
    
}

export const get_user = async(userid)=>{
    let user = await UserModel.findById(userid).select('-password -__v')
    if(!user){
        return UnAuthorizedException()
    }
    return user
}


export const generateAccessToken = async(token)=>{
    let decodeData = decodeRefreshToken(token)
    let Signature = undefined;
    switch(decodeData.aud){
        case"Admin":
            Signature = env.ADMIN_SIGNATURE
            break;
        default:
            Signature = env.USER_SIGNATURE
            break;
        }
    let accessToken = jwt.sign({id:decodeData.id},Signature,{
        expiresIn:"30m",
        audience:decodeData.aud
    })
    return accessToken
}

export const singupGoogle = async(token)=>{
    console.log(data);
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token.idToken,
      audience: WEB_CLIENT_ID,   
    });
    const payload = ticket.getPayload();
    console.log(payload)
    if(!payload.email_verified){
        throw BadRequestException({message:"email is not verified"})
    }
    let exsistUser = await UserModel.findOne({email:payload.email_verified})
    if(exsistUser){
        throw ConflictException({message:"User already exsit"})
    }else{
        let adduser = await UserModel.create({
            userName:payload.name,
            email:payload.email
        })
        if(adduser){
            return adduser
        }else{
            throw BadRequestException({message:"Something went wrong"})
        }
    }

  
}