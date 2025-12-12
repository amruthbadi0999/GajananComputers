import express from "express";
import {
    createLaptopRequest,
    getMyLaptopRequests,
} from "../controllers/laptopController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLaptopRequest);
router.get("/me", protect, getMyLaptopRequests);

export default router;
