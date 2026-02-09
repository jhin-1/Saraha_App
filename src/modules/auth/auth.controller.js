import {Router} from 'express';
import { SuccessResponse } from '../../common/utils/response/index.js';
import { singup ,login} from './auth.service.js';
const router = Router();

router.post('/signup', async(req,res)=>{
    let user = await singup(req.body);
    return SuccessResponse({res,message:"user created successfully",status:201,data:user})
}) 

router.post('/login', async(req,res)=>{
    let user = await login(req.body);
    return SuccessResponse({res,message:"user logged in successfully",status:200,data:user})
}) 



export default router;