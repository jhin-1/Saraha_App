import mongoose from "mongoose";
import { GenderEnums ,ProviderEnums} from "../../common/index.js";
const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLenght:2,
        maxLength:20
    },
    lastName:{
        type:String,
        require:true,
        minLenght:2,
        maxLength:20
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
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