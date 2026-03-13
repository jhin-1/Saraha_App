import {Router} from 'express';
import { SuccessResponse } from '../../common/utils/response/index.js';
import { singup ,login,verifyEmail,get_user,generateAccessToken, singupGoogle, get_profile, update_password,logout, forgetPassword, restPassword} from './auth.service.js';
import { auth } from '../../common/middleware/auth.js';
import {singupSchema , loginSchema } from './auth.validation.js';
import {validation} from '../../common/middleware/validation.js'
import { multer_local } from '../../common/middleware/multer.js';
const router = Router();

router.post('/signup', validation(singupSchema),multer_local({customPath:"Profile_images"}).single("image") , async(req,res)=>{
    let user = await singup(req.body,req.file);
    console.log(req.file)
    return SuccessResponse({res,message:"user created successfully",status:201,data:user})
}) 

router.post('/verify-email',async(req,res)=>{
    let data = await verifyEmail(req.body);
    return SuccessResponse({res,message:"email verified successfully",status:200})
})

router.post('/login', validation(loginSchema) , async(req,res)=>{
    let user = await login(req.body,`${req.protocol}://${req.host}`);
    return SuccessResponse({res,message:"user logged in successfully",status:200,data:user})
})

router.post("/logout",auth,async(req,res)=>{
    await logout(req);
    return SuccessResponse({res,message:"user logged out successfully",status:200})
})

router.get('/get-user',auth,async(req,res)=>{
    let user = await get_user(req.userId)
    return SuccessResponse({res,message:"User Found", status:200, data:user})
})

router.get('/user-profile/:id',async(req,res)=>{
    let UserProfile = await get_profile(req.params.id)
    return SuccessResponse({res, message:"User Profile Found", status:200, data:UserProfile})
})

router.get('/generate-access-Token',async(req,res)=>{
    let {authorization} = req.headers
    let accessToken = await generateAccessToken(authorization)
    return SuccessResponse({res,message:"Access Token created", status:200, data:accessToken})
})

router.post('/signup/gmail',async(req,res)=>{
    const data = await singupGoogle(req.body)
    return SuccessResponse({res,message:"user signup succesfully",status:200,data:data})
})

router.patch('/update-password',auth,async(req,res)=>{
    const {newPassword} = req.body;
    const data = await update_password(req.userId,newPassword);
    return SuccessResponse({res,message:"password updated successfully",status:200,data});
})

router.post('/forget-password',async(req,res)=>{
    await forgetPassword(req.body)
    return SuccessResponse({res,message:"otp sent successfully",status:200})
})
router.patch('/rest-password',async(req,res)=>{
    const data = await restPassword(req.body)
    return SuccessResponse({res,message:"password rest successfully",status:200,data})
})
export default router;