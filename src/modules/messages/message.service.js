import { BadRequestException, ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import { MessageModel, UserModel } from '../../database/index.js';


export const SendMessage = async(data,reciverId)=>{
    const {message,image} = data;
    let existUser = await UserModel.findById(reciverId);
    if(!existUser){
        return NotFoundException({message:"Reciver user not found"})
    }
    const newMessage = await MessageModel.create({
        message,
        image,
        reciverId
    }
    )
    if(newMessage){
        return newMessage;
    }else{
        return BadRequestException({message:"Failed to create message"})
    }
}

export const GetMessages = async(userId)=>{
    let messages = await MessageModel.find({reciverId:userId});
    if (!messages || messages.length === 0) {
        return NotFoundException({ message: "No messages found for this user" });
    }
    return messages;
}