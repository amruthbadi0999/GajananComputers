import mongoose from "mongoose";

const laptopRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["SELL", "BUY_REQUIREMENT"],
    required: true,
  },
  // Common Contact Info
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },

  // Laptop Details
  brand: { type: String, required: true },
  model: { type: String }, // Optional for BUY_REQUIREMENT if general
  processor: { type: String },
  ram: { type: String },
  storage: { type: String },
  condition: {
    type: String,
    enum: ["EXCELLENT", "GOOD", "AVERAGE", "NEEDS_REPAIR"],
    default: "GOOD",
  },

  // For SELL
  expectedPrice: { type: Number },
  additionalIssues: { type: String },
  images: [{ type: String }], // Array of image URLs

  // For BUY_REQUIREMENT
  purpose: { type: String },
  budgetRange: { type: String },
  urgency: {
    type: String,
    enum: ["URGENT", "THIS_WEEK", "THIS_MONTH"],
  },

  // Admin Controls
  status: {
    type: String,
    enum: ["NEW", "UNDER_REVIEW", "CONTACTED", "OFFER_GIVEN", "COMPLETED", "REJECTED"],
    default: "NEW",
  },
  adminNotes: { type: String },
}, { timestamps: true });

const LaptopRequest = mongoose.model("LaptopRequest", laptopRequestSchema);
export default LaptopRequest;
