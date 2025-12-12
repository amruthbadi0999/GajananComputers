import express from "express";
import {
    createServiceRequest,
    getMyServiceRequests,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createServiceRequest);
router.get("/me", protect, getMyServiceRequests);

export default router;
