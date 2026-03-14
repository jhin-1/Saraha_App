import { BadRequestException, ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import { MessageModel, UserModel } from '../../database/index.js';


export const SendMessage = async(data,reciverId,file)=>{
    const {message} = data;
    let existUser = await UserModel.findById(reciverId);
    if(!existUser){
        return NotFoundException({message:"Reciver user not found"})
    }
    let image_messaege;
    if(file){
        file.fullPath = `${file.destination}/${file.filename}`
        image_messaege = file.fullPath
    }
    const newMessage = await MessageModel.create({
        message,
        image: image_messaege? image_messaege : null,
        reciverId
    })
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

export const getMessage = async(messageId,userId)=>{
    let message = await MessageModel.findOne({_id:messageId,reciverId:userId});
    if (!message) {
        return NotFoundException({ message: "Message not found" });
    }
    return message;
};

export const deleteMessage = async(messageId,userId)=>{
    let message = await MessageModel.findByIdAndDelete({_id:messageId,reciverId:userId});
    if (!message) {
        return NotFoundException({ message: "Message not found" });
    }
    return message;
}