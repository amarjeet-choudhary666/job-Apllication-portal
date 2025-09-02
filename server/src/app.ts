import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRoutes from "./routes/userRoutes";
import jobRoutes from "./routes/jobRoutes";
import { ApiError } from "./utils/apiError";

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

export {app};
