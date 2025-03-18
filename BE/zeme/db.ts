import mongoose from "mongoose";

// MongoDB URI
const mongoURI: string = "mongodb://127.0.0.1:27017/zeme";

// Enable mongoose debug mode
mongoose.set('debug', true);

// Connect to MongoDB
const connectToMongo = (): void => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err: any) => {
            console.error("MongoDB connection error:", err);
        });
}

export default connectToMongo;
