import {Router} from 'express';
import { SuccessResponse } from '../../common/utils/response/index.js';
import { singup ,login,get_user} from './auth.service.js';
import { auth } from '../../common/utils/middleware/auth.js';
const router = Router();

router.post('/signup', async(req,res)=>{
    let user = await singup(req.body);
    return SuccessResponse({res,message:"user created successfully",status:201,data:user})
}) 

router.post('/login', async(req,res)=>{
    let user = await login(req.body,`${req.protocol}://${req.host}`);
    return SuccessResponse({res,message:"user logged in successfully",status:200,data:user})
}) 

router.get('/get-user',auth,async(req,res)=>{
    let user = await get_user(req.userId)
    return SuccessResponse({res,message:"User Found", status:200, data:user})
})

export default router;