import mongoose from "mongoose";

export const connectDb = async ()=>{

    try{
        const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://demomallick:S4yRUjSe5239KE4w@cluster0.0l8sk.mongodb.net/thumbProfile?retryWrites=true&w=majority";

     const conn = await  mongoose.connect(MONGO_URI )
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(error){
        console.error("MongoDB connection error:", error);
    }
      
}