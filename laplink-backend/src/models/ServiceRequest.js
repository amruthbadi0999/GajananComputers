import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: false }, // Optional for carry-in
    city: { type: String, required: false },

    brand: { type: String, required: true },
    model: { type: String, required: false },

    problems: [{
        type: String,
        enum: ["SPEAKER", "KEYBOARD", "DISPLAY", "BATTERY", "OS_INSTALL", "MOTHERBOARD", "HINGE", "OTHER"]
    }],
    customProblem: { type: String },

    preferredServiceType: {
        type: String,
        enum: ["CARRY_IN", "PICKUP_DROP"],
        required: false,
    },
    preferredTimeSlot: {
        type: String,
        enum: ["MORNING", "AFTERNOON", "EVENING"],
    },
    underWarranty: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ["NEW", "DIAGNOSING", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"],
        default: "NEW",
    },
    adminNotes: { type: String },
}, { timestamps: true });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
