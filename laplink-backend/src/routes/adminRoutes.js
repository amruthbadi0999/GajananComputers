import express from "express";
import {
    getAllLaptopRequests,
    updateLaptopRequestStatus,
} from "../controllers/laptopController.js";
import {
    getAllServiceRequests,
    updateServiceRequestStatus,
} from "../controllers/serviceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Laptop Requests (Buy/Sell)
router.get("/laptops", protect, admin, getAllLaptopRequests);
router.patch("/laptops/:id", protect, admin, updateLaptopRequestStatus);

// Service Requests (Repairs)
router.get("/service", protect, admin, getAllServiceRequests);
router.patch("/service/:id", protect, admin, updateServiceRequestStatus);

export default router;
