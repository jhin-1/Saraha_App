import { client } from "./connection.js";


export const set =async ({key,value,ttl}={})=>{
    if(typeof value === "object"){
        value = JSON.stringify(value); // convert object to string before storing in redis
    }
    return await client.set(key,value,{EX:ttl});
}

export const get = async (key)=>{
    let data =  await client.get(key);
    try{
        data = JSON.parse(data) // convert string back to object if it was stored as an object
    }catch{
        // ignore JSON parse error
    }
    return data
}

export const ttl = async (key)=>{
    return await client.ttl(key);
}

export const exists = async (key)=>{
    return await client.exists(key);
}

export const dele = async (key)=>{
    return await client.del(key);
}

export const mget = async (...keys)=>{
    return await client.mGet(keys);
}

export const keys = async (prefix)=>{
    return await client.keys(`${prefix}*`);
}