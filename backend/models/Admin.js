const mongoose = require("mongoose")

const AdminRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  },
)

// Index for better query performance
AdminRequestSchema.index({ user: 1, status: 1 })
AdminRequestSchema.index({ status: 1 })
AdminRequestSchema.index({ createdAt: -1 })

module.exports = mongoose.model("AdminRequest", AdminRequestSchema)
