import express from 'express';
import {env} from '../config/index.js';
import {DataBaseConnection} from './database/index.js';
import { globalErrorHandler } from './common/utils/response/index.js';
import authRouter from './modules/auth/auth.controller.js';
import messageRouter from './modules/messages/message.controller.js';
import userRouter from './modules/user/user.controller.js';
import { client, connectRedis } from './database/redis/connection.js';
import cors from 'cors';
import helmet from 'helmet';


export const bootstrap = async ()=>{
    const app = express();
    const port = env.PORT

    app.use(express.json());
    app.use("/upload",express.static("upload"))
    app.use(cors({
    origin: 'http://localhost:4200'
    }))
    app.use(helmet());

    // routes
    app.use('/api/v1/auth',authRouter);
    app.use('/api/v1/message',messageRouter);
    app.use('/api/v1/users',userRouter);

    //database connection
    await DataBaseConnection();
    // connect to redis
    await connectRedis();
    // handel invalid route
    app.use('{*dummy}',(req,res)=>res.status(404).json("Invalid route"));

    // handel erorr 
    app.use(globalErrorHandler);

    
    app.listen(port,()=>console.log(`server is running on port ${port}`));
}