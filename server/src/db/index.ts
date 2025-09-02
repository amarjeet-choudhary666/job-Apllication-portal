import mongoose from "mongoose";


export const connectDB = async (mongoUri: string) => {
    try {
        const connectionInstances = await mongoose.connect(mongoUri, {
            dbName: "job_portal"
        });
        console.log(`MongoDB connected: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.error(`failed to connnect the db: ${(error as Error).message}`);
        process.exit(1);
    }
}