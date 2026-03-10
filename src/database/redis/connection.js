import { createClient } from "redis"
import { env } from "../../../config/index.js";

 
export const client = createClient({
  url: env.REDIS_URI
});

client.on("error", function(err) {
  throw err;
});

export const connectRedis = async () => {
  try{
    await client.connect();
    console.log("Connected to Redis");
  }catch(err){
    console.error("Error connecting to Redis:", err);
  }
};

