import { ProviderEnums } from '../../common/index.js';
import { ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import {UserModel} from '../../database/index.js';
import { hashPassword, comparePassword } from '../../common/index.js';
import {env} from '../../../config/index.js'
import jwt from 'jsonwebtoken';

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
//     
export const login = async(data,host)=>{
    // destarct the Data from the object prameter 
    let {email,password} = data;
    // get user by email
    let userexist = await UserModel.findOne({email, provider:ProviderEnums.System}).select(" -__v");
    if(userexist){
        let Signature = undefined; // genrate secret_key for [admin or user]
        let audience = undefined; // for know if this token for user of admin 
    
        switch(userexist.role){
        case"0": // 0 is admin 
            Signature = env.ADMIN_SIGNATURE
            audience = "Admin"
            break;

        default:
            Signature = env.USER_SIGNATURE
            audience = "User"
            break;
        }

        const isMatch = await comparePassword(password,userexist.password);
        if(isMatch){
            let user_token = jwt.sign({id:userexist._id},Signature,{ 
                expiresIn:"1d",
                notBefore:"30s",
                issuer:host,
                audience
            }) // generate token with user id and secret keY
            return {Token:user_token,user:userexist};
        }
    }
    return NotFoundException({message:"User not Found!"})
    
}

export const get_user = async(userid)=>{
    let user = await UserModel.findById(userid).select('-password -__v')
    if(!user){
        return UnAuthorizedException()
    }
    return user
}
