const User = require("../models/User")
const AdminRequest = require("../models/Admin")

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id

      // Get user details
      const user = await User.findById(userId).select("-password")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Get admin request status
      const adminRequest = await AdminRequest.findOne({
        user: userId,
      }).sort({ createdAt: -1 })

      const profile = {
        id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        adminRequestStatus: adminRequest ? adminRequest.status : null,
      }

      res.json(profile)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id
      const { firstName, lastName, username } = req.body

      // Validate input
      if (!firstName || !lastName || !username) {
        return res.status(400).json({ message: "First name, last name, and username are required" })
      }

      // Check if username is already taken by another user
      if (username) {
        const existingUser = await User.findOne({ 
          username: username, 
          _id: { $ne: userId } 
        })
        if (existingUser) {
          return res.status(400).json({ message: "Username is already taken" })
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { 
          firstName: firstName.trim(), 
          lastName: lastName.trim(),
          username: username.trim()
        }, 
        { new: true }
      ).select("-password")

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update localStorage username if it changed
      const responseData = {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          username: updatedUser.username,
          role: updatedUser.role,
        },
      }

      res.json(responseData)
    } catch (error) {
      console.error("Error updating user profile:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Request admin access
  static async requestAdminAccess(req, res) {
    try {
      const { reason, experience } = req.body
      const userId = req.user.id

      if (!reason || reason.trim() === "") {
        return res.status(400).json({ message: "Reason is required" })
      }

      // Check if user already has a pending request
      const existingRequest = await AdminRequest.findOne({
        user: userId,
        status: "pending",
      })

      if (existingRequest) {
        return res.status(400).json({ message: "You already have a pending admin request" })
      }

      // Create new admin request
      const request = new AdminRequest({
        user: userId,
        reason: reason.trim(),
        experience: experience ? experience.trim() : "",
      })

      await request.save()

      res.status(201).json({
        message: "Admin request submitted successfully",
        request: {
          id: request._id,
          reason: request.reason,
          experience: request.experience,
          status: request.status,
          createdAt: request.createdAt,
        },
      })
    } catch (error) {
      console.error("Error creating admin request:", error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

module.exports = UserController