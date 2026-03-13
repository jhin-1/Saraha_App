import { EventEmitter } from "events";
import { sendEmail } from "./sendemail.js";
import { set } from "../../../database/redis/redis.service.js";
import { hashPassword } from "../../hash/hash.js";

let code = Math.random().toFixed(4).split(".")[1]

let emailEvent = new EventEmitter();

emailEvent.on("verifyEmail",async(data)=>{
    let {email,userId} = data;
    await set({
            key:`Otp::${userId}`,
            value:code,
            ttl:60*5 // 5 minutes
        })
        await sendEmail({
            to:email,
            subject:"send verification email",
            html:`<h1>verify your email with this code ${code}</h1>
            <p>Please Enter the code to verify your email.</p>`
        })
})
emailEvent.on("forgetPassword",async(data)=>{
    let {email,userId} = data;
    await set({
                key:`otp::${userId}`,
                value:await hashPassword(code),
                ttl:60*10
        })
            await sendEmail({
                to: email,
                subject: "rest password",
                html:`<h1>rest password<h1><br><p>${code}</p>`
            })
})
export default emailEvent;