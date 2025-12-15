import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import laptopRoutes from "./routes/laptopRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifySMTP } from "./services/email.service.js";

// Load env variables
dotenv.config();

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/laptops", laptopRoutes); // Buy / Sell
app.use("/api/service", serviceRoutes); // Repairs
app.use("/api/admin", adminRoutes); // Admin Management

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running successfully", environment: process.env.NODE_ENV });
});

// Server listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    // Verify SMTP once on startup to catch misconfig fast (non-blocking)
    verifySMTP();
});