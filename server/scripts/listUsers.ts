import { connectDB } from "../src/db";
import { User } from "../src/models/userModel";
import dotenv from "dotenv";

dotenv.config();

async function listUsers() {
  try {
    await connectDB(process.env.MONGO_URI!);
    
    console.log("Fetching users...");
    const users = await User.find({}).select('-password -refreshToken');
    
    console.log("\n=== USERS IN DATABASE ===");
    console.log(JSON.stringify(users, null, 2));
    console.log("\nTotal users:", users.length);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listUsers();
