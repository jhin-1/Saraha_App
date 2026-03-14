import {Router} from 'express';
import { SuccessResponse } from '../../common/utils/response/index.js';
import { auth } from '../../common/middleware/auth.js';
import {validation} from '../../common/middleware/validation.js'
import { deleteMessage, getMessage, GetMessages, SendMessage } from './message.service.js';
import { sendMessageSchema } from './message.validation.js';
import { multer_local } from '../../common/middleware/multer.js';

const router = Router();

router.post('/sendmessage/:id',validation(sendMessageSchema),multer_local({customPath:"messages_image"}).single('image'),async(req,res)=>{
    let {id} = req.params;
    const data = await SendMessage(req.body,id,req.file);
    return SuccessResponse({res,message:'Message created successfully',status:201,data});
});
router.get('/getmessages',auth,async(req,res)=>{
    const messages = await GetMessages(req.userId);
    return SuccessResponse({res,message:'Messages retrieved successfully',status:200,data:messages});
});

router.get('/getmessage/:id',auth,async(req,res)=>{
    const {id} = req.params;
    const message = await getMessage(id,req.userId);
    return SuccessResponse({res,message:'Message retrieved successfully',status:200,data:message});
});

router.delete('/deletemessage/:id',auth,async(req,res)=>{
    const {id} = req.params;
    const message = await deleteMessage(id,req.userId);
    return SuccessResponse({res,message:'Message deleted successfully',status:200,data:message});
});

export default router;