import { ProviderEnums } from '../../common/index.js';
import { ConflictException,UnAuthorizedException } from '../../common/utils/response/index.js';
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

export const login = async(data)=>{
    // destarct the Data from the object prameter 
    let {email,password} = data;
    // get user by email
    let userexist = await UserModel.findOne({email, provider:ProviderEnums.System}).select(" -__v"); 

    let user_token = jwt.sign({id:userexist._id},env.JWT_KEY) // generate token with user id and secret key
    
    if(!userexist){
        return ConflictException({message:"email or password is incorrect"});
    }

    let isMatch = await comparePassword(password,userexist.password);


    if(!isMatch){
        return ConflictException({message:"email or password is incorrect"});
    }
    return {Token:user_token,user:userexist};
}

export const get_user = async(token)=>{
    try{
        let {id} = jwt.verify(token,"secretkey"); // {id:user,iat:timestamp} return object
        let user = await UserModel.findById(id).select("-password -__v");
        if(!user){
        return UnAuthorizedException()
        }    
    }catch{
        return UnAuthorizedException({message:"Invalid token"});
    }    
    return user; 
}
