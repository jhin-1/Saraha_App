import {Router} from "express";
import { auth } from "../../common/middleware/auth.js";
import { SuccessResponse } from "../../common/utils/response/index.js";
import { get_profile, update_user,copy_profile_link,get_user_data,delete_user } from "./user.service.js";
import {multer_local} from '../..//common/middleware/multer.js'

const router = Router();

router.get("/get-user-profile",auth,async(req,res)=>{
    let user_profile = await get_profile(req.userId)
    SuccessResponse({res,message:"Successfully retrieved user profile",status:200,data:user_profile})
})

router.get("/copy-profile-link",auth,async(req,res)=>{
    let data = await copy_profile_link(req.userId)
    SuccessResponse({res,message:"profile link copied",status:200,data:data})
})

router.get("/get-user-data",async(req,res)=>{
    let data = await get_user_data(req.body.sharelinkProfile)
    SuccessResponse({res,message:"Successfully retrieved user data",status:200,data})
})

router.patch("/update-profile",multer_local({customPath:"user_profiles"}).single('image'),auth,async(req,res)=>{
    let data = await update_user(req.userId,req.body,req.file)
    SuccessResponse({res,message:"updated sucessfully",status:201,data})
})

router.delete("/delete-profile",auth,async(req,res)=>{
    let data = await delete_user(req.userId)
    SuccessResponse({res,message:"deleted sucessfully",status:200,data})
})


export default router