import mongoose from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017/learneraDB";

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌", error);
    process.exit(1); // Exit process on failure
  }
}

export default dbConnect;
