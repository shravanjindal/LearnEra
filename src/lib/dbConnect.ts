import mongoose from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017/learneraDB";

async function dbConnect() {
  try {
    // Check if mongoose is already connected
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB ✅");
      return;
    }

    // If not, establish a new connection
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB Connected ✅");

  } catch (error) {
    console.error("MongoDB Connection Error ❌", error);
    process.exit(1); // Exit process on failure
  }
}

export default dbConnect;
