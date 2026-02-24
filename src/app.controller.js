import express from 'express';
import {env} from '../config/index.js';
import {DataBaseConnection} from './database/index.js';
import { globalErrorHandler } from './common/utils/response/index.js';
import authRouter from './modules/auth/auth.controller.js';
import cors from 'cors';

export const bootstrap = async ()=>{
    const app = express();
    const port = env.PORT

    app.use(express.json());
    app.use(cors())
    // routes
    app.use('/api/v1/auth',authRouter);
    
    app.use('{*dummy}',(req,res)=>res.status(404).json("Invalid route"));

    // handel erorr 
    app.use(globalErrorHandler);

    //database connection
    await DataBaseConnection();




    app.listen(port,()=>console.log(`server is running on port ${port}`));
}