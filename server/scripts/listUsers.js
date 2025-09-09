"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/db");
const userModel_1 = require("../src/models/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function listUsers() {
    try {
        await (0, db_1.connectDB)(process.env.MONGO_URI);
        console.log("Fetching users...");
        const users = await userModel_1.User.find({}).select('-password -refreshToken');
        console.log("\n=== USERS IN DATABASE ===");
        console.log(JSON.stringify(users, null, 2));
        console.log("\nTotal users:", users.length);
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
listUsers();
