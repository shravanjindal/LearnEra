import mongoose from "mongoose";
import "@/models/skillTracker"; // ✅ Ensure the model is registered globally
import "@/models/user"; // ✅ Ensure User model is also registered

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

export default async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        return; // Already connected
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "learneraDB",
            bufferCommands: false,
        });
        console.log("Database connected ✅");
        console.log("Registered Models:", mongoose.modelNames()); // ✅ Debugging line
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
