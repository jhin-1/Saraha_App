import { env } from "../../../config/index.js";
import { BadRequestException } from "../../common/utils/response/index.js"
import { UserModel } from "../../database/index.js";




export const get_profile =async(userId)=>{
    const user = await UserModel.findById(userId).select("_id firstName lastName email sharelinkProfile image_profile")
    if(!user){
        BadRequestException({message:"user not found"})
    }
    return user
}

export const copy_profile_link = async(userId)=>{
    let user = await UserModel.findById(userId).select("sharelinkProfile -_id");
    if (!user) {
        BadRequestException({ message: "User not found" });
    }
    if (!user.sharelinkProfile) { // for case the user doesn't have a profile link yet or old user 
        BadRequestException({ message: "Profile link not found" });
    }
    return user;
}

export const get_user_data = async(data)=>{
    let user = await UserModel.findOne({sharelinkProfile:data}).select("-_id firstName lastName email image_profile")
    if(!user){
        BadRequestException({message:"user not found"})
    }
    return user
}

export const update_user = async(userId,data,file)=>{
    let image = null;
    if(file){
        file.finalpath = `${file.destination}/${file.filename}`
        image = file.finalpath
    }
    let user_update = await UserModel.findByIdAndUpdate(userId,{...data,image_profile:image?image:null},{new:true})
    if(user_update){
        return user_update
    }
    BadRequestException({message:"user not found"})
    
}

export const delete_user = async(userId)=>{
    let user_delete = await UserModel.findByIdAndDelete(userId)
    if(user_delete){
        return user_delete
    }
    BadRequestException({message:"user not found"})
}


