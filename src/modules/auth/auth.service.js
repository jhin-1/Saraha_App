import { ProviderEnums } from '../../common/index.js';
import { ConflictException } from '../../common/utils/response/index.js';
import {UserModel} from '../../database/index.js';   

export const singup = async(data)=>{
    let {userName,email,password} = data;
    let userexist = await UserModel.findOne({email});
    if(userexist){
        return ConflictException({message:"email already exist"});
    }
    let user = await UserModel.insertOne({userName,email,password});
    return user;

}

export const login = async(data)=>{
    let {email,password} = data;
    let userexist = await UserModel.findOne({email,password, provider:ProviderEnums.System}).select("-password -__v");
    if(!userexist){
        return ConflictException({message:"email or password is incorrect"});
    }
    return userexist;

}