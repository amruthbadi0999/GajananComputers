import ServiceRequest from "../models/ServiceRequest.js";
import { notifyAdminNewRequest } from "../services/email.service.js";

// User: Create Service Request
export const createServiceRequest = async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            city,
            brand,
            model,
            problems,
            customProblem,
            preferredServiceType,
            preferredTimeSlot,
            underWarranty,
        } = req.body;

        const newRequest = new ServiceRequest({
            userId: req.user.id,
            name,
            phone,
            address,
            city,
            brand,
            model,
            problems,
            customProblem,
            preferredServiceType,
            preferredTimeSlot,
            underWarranty,
        });

        await newRequest.save();

        try {
            await notifyAdminNewRequest("Service", {
                userId: req.user?.id || req.userId,
                name,
                phone,
                address,
                city,
                brand,
                model,
                problems,
                customProblem,
                preferredServiceType,
                preferredTimeSlot,
                underWarranty,
            });
        } catch (e) { /* ignore */ }

        res.status(201).json({
            message: "Service request created successfully",
            request: newRequest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User: Get My Requests
export const getMyServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get All Requests
export const getAllServiceRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const requests = await ServiceRequest.find(filter).populate("userId", "name email phone").sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update Status
export const updateServiceRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const request = await ServiceRequest.findByIdAndUpdate(
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
