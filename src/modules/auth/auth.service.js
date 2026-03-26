import { generateToken, ProviderEnums } from '../../common/index.js';
import { BadRequestException, ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import {UserModel} from '../../database/index.js';
import { hashPassword, comparePassword,decodeRefreshToken } from '../../common/index.js';
import { env } from '../../../config/index.js';
import jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library'; 

import {set,get} from '../../database/redis/redis.service.js';
import emailEvent from '../../common/utils/email/email.event.js';


let code = Math.random().toFixed(4).split(".")[1]

export const singup = async(data,file)=>{
    let {userName,email,password} = data;
    let image = ""
    if(file){
        file.finalpath = `${file.destination}/${file.filename}`
        image = file.finalpath
    }
    let userexist = await UserModel.findOne({email});
    if(userexist){
        return ConflictException({message:"email already exist"});
    }
    let profile_link = `${env.BASE_URL}${userName.split(" ").join("")+code}.com`
    let hashpassword = await hashPassword(password);
    let user = await UserModel.create({userName,email,password:hashpassword,image_profile:image?image:null,sharelinkProfile:profile_link});
   // send verification email by event emitter to not take long time in response
    emailEvent.emit("verifyEmail",{userId:user._id,email})
    return user;
}

export const verifyEmail = async(data)=>{
    let {email,otp} = data
    let user = await UserModel.findOne({email})
    if(!user){
        return NotFoundException({message:"email not found"})
    }
    let Otp = await get(`Otp::${user._id}`)
    if(otp == Otp){
        user.emailVerified = true;
        await user.save();
        return "email verified successfully"
    }else{
        return BadRequestException({message:"invalid otp"})
    }
}

export const login = async (data, host) => {
    let { email, password } = data;

    let userexist = await UserModel.findOne({email,provider: ProviderEnums.System}).select("-__v");
    if (!userexist) {
        return UnAuthorizedException({ message: "Unauthorized ---" });
    }

    if (userexist.BlockTime && userexist.BlockTime > Date.now()) {
        return UnAuthorizedException({message: "Account Blocked. Try again after 5 minutes."});
    }
    
    const isMatch = await comparePassword(password, userexist.password);
 


    if (!isMatch) {

        userexist.consecutive_times += 1;

        if (userexist.consecutive_times === 5) {
            userexist.BlockTime = Date.now() + 5 * 60 * 1000;
        }

        await userexist.save();

        return UnAuthorizedException({ message: "Unauthorized---Password-" });
    }

    userexist.consecutive_times = 0;
    userexist.BlockTime = undefined;
    await userexist.save();

    let { accessToken, RefreshToken } = generateToken(userexist, host);

    return { accessToken, RefreshToken, user: userexist };
};

export const logout = async(req)=>{
    let redis_key = `revokeToken:${req.userId}::${req.token}`;
    await set({
        key: redis_key,
        value: 1 ,
        ttl:req.decode.iat +30 *60
    });

}
// api for test only
export const get_user = async(userid)=>{
    let user = await UserModel.findById(userid).select('-password -__v')
    if(!user){
        return UnAuthorizedException()
    }
    return user
}
 // api for get user profile and add visit count
export const get_profile = async(userId)=>{
    let userProfile = await UserModel.findById(userId).select("-password -__v -gender -role -provider") 
    if(!userProfile){
        return NotFoundException({message:"User not found"})
    }
    userProfile.Visits += 1;
    await userProfile.save();
    return userProfile;
}

export const generateAccessToken = async(token)=>{
    let Toekn = token.split(" ")[1]
    let decodeData = decodeRefreshToken(Toekn)
    console.log("The request is used")
    let Signature = undefined;
    switch(decodeData.aud){
        case"Admin":
            Signature = env.ADMIN_SIGNATURE
            break;
        default:
            Signature = env.USER_SIGNATURE
            break;
        }
    let accessToken = jwt.sign({id:decodeData.id},Signature,{
        expiresIn:"30m",
        audience:decodeData.aud
    })
    return accessToken
}

export const singupGoogle = async(token) => {
    // token is expected to contain an idToken from the client
    const client = new OAuth2Client(env.WEB_CLIENT_ID || env.GOOGLE_CLIENT_ID);

    // verify the token and extract user information
    const ticket = await client.verifyIdToken({
         idToken: token.idToken,
        audience: env.WEB_CLIENT_ID || env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Google returns a boolean field email_verified
    if (!payload || !payload.email_verified) {
        throw BadRequestException({ message: "Email is not verified" });
    }

    // look for an existing user by email
    let existUser = await UserModel.findOne({ email: payload.email });
    if (existUser) {
        throw ConflictException({ message: "User already exists" });
    }

    // create a new user record
    let adduser = await UserModel.create({
        userName: payload.name,
        email: payload.email,
        provider: ProviderEnums.Google,
    });

    if (!adduser) {
        throw BadRequestException({ message: "Something went wrong" });
    }

    return adduser;
};

export const update_password = async(userId,password)=>{
    let hashpassword = await hashPassword(password);
    let userexist = await UserModel.findById(userId)
    if(!userexist){
        return NotFoundException({message:"User not found"})
    }
    userexist.password = hashpassword;
    await userexist.save();
    return userexist;
}

export const forgetPassword = async(data)=>{
    let {email} = data
    console.log(email, "from auth service forget password")
    let existeduser = await UserModel.findOne({email})
    if(!existeduser){
        BadRequestException({message:"user Not found"})
    }else{
        emailEvent.emit("forgetPassword",{userId:existeduser._id,email})
    }
}

export const restPassword = async(data)=>{
    let {email,otp,password} = data
    let existedUser = await UserModel.findOne({email})
    if(!existedUser){
        NotFoundException({message:"email not found"})
    }

    let hashotp = await get(`otp::${existedUser._id}`)
    if(await comparePassword(otp,hashotp)){
        if(await comparePassword(password,existedUser.password)){
            return BadRequestException({message:"new password must be different from old password"})
        }else{
            let hashpassword = await hashPassword(password);
            let updatedUser = await UserModel.findByIdAndUpdate(existedUser._id,{password:hashpassword},{new:true}).select("-password -__v")
            return updatedUser;
        }
    }
}

export const resendOtp = async(data)=>{
    let {email} = data
    let existedUser = await UserModel.findOne({email})
    if(!existedUser){
        return NotFoundException({message:"email not found"})
    }
    await set({
        key:`Otp::${existedUser._id}`,
        value:code,
        ttl:60*5 // 5 minutes
    })
    emailEvent.emit("resendOtp",{userId:existedUser._id,email})
}