import { app } from "./app";
import { connectDB } from "./db";
import dotenv from "dotenv";
dotenv.config();


const mongoUri = process.env.MONGO_URI 

connectDB(mongoUri!)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
})