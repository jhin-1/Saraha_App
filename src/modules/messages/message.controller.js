import {Router} from 'express';
import { SuccessResponse } from '../../common/utils/response/index.js';
import { auth } from '../../common/middleware/auth.js';
import {validation} from '../../common/middleware/validation.js'
import { GetMessages, SendMessage } from './message.service.js';
import { sendMessageSchema } from './message.validation.js';
const router = Router();

router.post('/sendmessage/:id',validation(sendMessageSchema),async(req,res)=>{
    let {id} = req.params;
    const data = await SendMessage(req.body,id);
    return SuccessResponse({res,message:'Message created successfully',status:201,data});
})
router.get('/getmessages',auth,async(req,res)=>{
    const messages = await GetMessages(req.userId);
    return SuccessResponse({res,message:'Messages retrieved successfully',status:200,data:messages});
})
export default router;