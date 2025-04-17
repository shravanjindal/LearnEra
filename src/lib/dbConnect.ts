import mongoose from "mongoose";
import "@/models/skillTracker"; // Ensure the model is registered globally
import "@/models/user"; // Ensure User model is also registered

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in your .env file");
}

export default async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to the database ✅");
        return; // Already connected
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "learneraDB", // Optional if you're using a specific DB
            bufferCommands: false, // Disable mongoose buffering
            useNewUrlParser: true, // Ensures compatibility with the MongoDB URL parser
            useUnifiedTopology: true, // Enables the new connection management engine
        } as mongoose.ConnectOptions); // Ensures the correct TypeScript type for connection options
        
        console.log("Database connected ✅");

        // Debugging line: Shows registered models for confirmation
        console.log("Registered Models:", mongoose.modelNames());
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Failed to connect to the database.");
    }
}
