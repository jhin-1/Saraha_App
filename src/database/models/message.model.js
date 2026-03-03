import mongoose, { Types } from 'mongoose';


export const MessageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
        min:10,
        max:500
    },
    reciverId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    image:{
        type:String,
    }

},
    {timestamps:true}
)


export const MessageModel = mongoose.model('Message',MessageSchema)