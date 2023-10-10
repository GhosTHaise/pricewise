import mongoose from "mongoose";

let isConnected = false; //variable to track the connection status

export const connectToDb = async () => {
    mongoose.set("strictQuery" , true);
    if(!process.env.NEXT_MONGODB_URI) return console.log("MONGODB URI is not defined");
    
    if(isConnected) return console.log("=> using existing database connection .");
    
    try {
        await mongoose.connect(process.env.NEXT_MONGODB_URI);

        isConnected = true;

        console.log("=> MongoDb connected !");
    } catch (error) {
        console.log(error);
        
    }
}