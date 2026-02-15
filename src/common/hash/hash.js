import  {hash,compare} from 'bcrypt';
import { env } from '../../../config/index.js';


export const  hashPassword = async(password)=>{
    let HashPassword = await hash(password,Number(env.SALT));
    return HashPassword;
}

export const comparePassword = async(password,hash)=>{
    let comparePass = await compare(password,hash)
    return comparePass;
}