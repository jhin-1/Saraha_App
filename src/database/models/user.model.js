import mongoose from "mongoose";
import { GenderEnums ,ProviderEnums, RoleEnums} from "../../common/index.js";
const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLenght:2,
        maxLength:20
    },
    lastName:{
        type:String,
        required:true,
        minLenght:2,
        maxLength:20
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:String,
    DOB:Date,
    gender:{
        type:String,
        enum:Object.values(GenderEnums), // convert the object to array of values
        default:GenderEnums.Male
    },
    provider:{
        type:String,
        enum:Object.values(ProviderEnums), // convert the object to array of values
        default:ProviderEnums.System
    },
    role:{
        type:String,
        enum:Object.values(RoleEnums),
        default:RoleEnums.User
    },
    image_profile:{
        type:String
    },
    Visits:{
        type:Number,
        default:0
    },
    consecutive_times:{
        type:Number,
        default:0
    },
    BlockTime:{
        type:Date
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String
    },
    sharelinkProfile:{
        type:String,
        
    },
    towfa:{
        type:Boolean,
        default:false
    }


})

UserSchema.virtual("userName").set(function(value){
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

export const UserModel = mongoose.model("User",UserSchema)