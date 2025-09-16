import mongoose from "mongoose";

const connectDb = async() =>
{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    }
    catch(error){
        console.log("MongoDB Connection Failed", error);
        throw error;  
    }
}

export default connectDb;
