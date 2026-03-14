import mongoose from "mongoose";
import {env} from "../../config/index.js";

export const DataBaseConnection = async()=>{

    await mongoose.connect(env.MONGO_URI_PROD).then(()=>{
        console.log("DataBase connected successfully");
    }).catch((err)=>{
        console.log("DataBase connection failed", err);
    })
}

