import LaptopRequest from "../models/LaptopRequest.js";
import { notifyAdminNewRequest } from "../services/email.service.js";

// User: Create Request
export const createLaptopRequest = async (req, res) => {
    try {
        const {
            type,
            name,
            phone,
            city,
            brand,
            model,
            processor,
            ram,
            storage,
            condition,
            expectedPrice,
            additionalIssues,
            purpose,
            budgetRange,
            urgency,
        } = req.body;

        const newRequest = new LaptopRequest({
            userId: req.user.id,
            type,
            name,
            phone,
            city,
            brand,
            model,
            processor,
            ram,
            storage,
            condition,
            expectedPrice,
            additionalIssues,
            purpose,
            budgetRange,
            urgency,
        });

        await newRequest.save();

        try {
            await notifyAdminNewRequest(
                type === 'SELL' ? 'Sell' : 'Buy',
                {
                    userId: req.user?.id || req.userId,
                    type,
                    name,
                    phone,
                    city,
                    brand,
                    model,
                    processor,
                    ram,
                    storage,
                    condition,
                    expectedPrice,
                    additionalIssues,
                    purpose,
                    budgetRange,
                    urgency,
                }
            );
        } catch (e) { /* non-blocking */ }

        res.status(201).json({
            message: "Request created successfully",
            request: newRequest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User: Get My Requests
export const getMyLaptopRequests = async (req, res) => {
    try {
        const requests = await LaptopRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get All Requests
export const getAllLaptopRequests = async (req, res) => {
    try {
        const { type, status } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;

        const requests = await LaptopRequest.find(filter).populate("userId", "name email phone").sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update Status
export const updateLaptopRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const request = await LaptopRequest.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        );

        if (!request) return res.status(404).json({ message: "Request not found" });

        res.status(200).json({ message: "Request updated", request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
