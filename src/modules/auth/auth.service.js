import { generateToken, ProviderEnums } from '../../common/index.js';
import { BadRequestException, ConflictException,NotFoundException,UnAuthorizedException } from '../../common/utils/response/index.js';
import {UserModel} from '../../database/index.js';
import { hashPassword, comparePassword,decodeRefreshToken } from '../../common/index.js';
import { env } from '../../../config/index.js';
import jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library'; 
import { generateCode, sendEmail } from '../../common/utils/sendemail/sendemail.js';


export const singup = async(data)=>{
    let {userName,email,password} = data;
    let userexist = await UserModel.findOne({email});
    if(userexist){
        return ConflictException({message:"email already exist"});
    }
    let hashpassword = await hashPassword(password);
    let user = await UserModel.create({userName,email,password:hashpassword});
    return user;

}

export const login = async (data, host) => {
    let { email, password } = data;

    let userexist = await UserModel.findOne({email,provider: ProviderEnums.System}).select("-__v");

    if (!userexist) {
        return UnAuthorizedException({ message: "Unauthorized" });
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

        return UnAuthorizedException({ message: "Unauthorized" });
    }

    userexist.consecutive_times = 0;
    userexist.BlockTime = undefined;
    await userexist.save();

    let { accessToken, RefreshToken } = generateToken(userexist, host);

    return { accessToken, RefreshToken, user: userexist };
};

export const get_user = async(userid)=>{
    let user = await UserModel.findById(userid).select('-password -__v')
    if(!user){
        return UnAuthorizedException()
    }
    return user
}

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
    let decodeData = decodeRefreshToken(token)
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

export const sendverificationEmail = async(userId,email)=>{
    const user = await UserModel.findOne({ _id: userId, email });
    if(!user){
        return NotFoundException({message:"User not found"})
    }
    const code = generateCode();
    user.verificationCode = code;
    await user.save();
    let  text = `Your verification code for Email is: ${code}`;
    let subject = "Email Verification";
    console.log("Email being sent to:", email);
    await sendEmail(
        email,
        subject,
        text
    );
    return { message: "Verification email sent successfully"};
}

export const step_2 = async(userId,code)=>{
    const user = await UserModel.findById(userId);
    if (!user){
        return UnAuthorizedException({message:"unauthorized!!"})
    }
    if(user.verificationCode !== code){
        return BadRequestException({message:"Invalid verification code"})
    }
    user.emailVerified = true;
    await user.save();
    return user.emailVerified;
}