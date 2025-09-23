const AdminRequest = require("../models/Admin");
const User = require("../models/User");

class AdminController {
  // Submit admin access request
  static async requestAdminAccess(req, res) {
    try {
      const { reason, experience } = req.body;
      const userId = req.user.id;

      if (!reason || reason.trim() === "") {
        return res.status(400).json({ message: "Reason is required" });
      }

      // Check if user already has a pending request
      const existingRequest = await AdminRequest.findOne({
        user: userId,
        status: "pending",
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "You already have a pending admin request" });
      }

      // Create new admin request
      const request = new AdminRequest({
        user: userId,
        reason,
        experience,
      });

      await request.save();

      res.status(201).json({
        message: "Admin request submitted successfully",
        request,
      });
    } catch (error) {
      console.error("Error creating admin request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get all pending admin requests (admin only)
  static async getPendingRequests(req, res) {
    try {
      const requests = await AdminRequest.find({ status: "pending" })
        .populate("user", "firstName lastName email username")
        .sort({ createdAt: -1 });

      const formattedRequests = requests
        .filter(request => request.user) 
        .map((request) => ({
            id: request._id,
            reason: request.reason,
            experience: request.experience,
            status: request.status,
            createdAt: request.createdAt,
            user: {
              id: request.user._id,
              firstName: request.user.firstName || request.user.username,
              lastName: request.user.lastName || "",
              email: request.user.email,
            },
        }));

      res.json(formattedRequests);
    } catch (error) {
      console.error("Error fetching admin requests:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Approve admin request (admin only)
  static async approveRequest(req, res) {
    try {
      const requestId = req.params.id;
      const processedBy = req.user.id;

      // Find the request
      const request = await AdminRequest.findOne({
        _id: requestId,
        status: "pending",
      });

      if (!request) {
        return res
          .status(404)
          .json({ message: "Request not found or already processed" });
      }

      // Update user role to admin
      await User.findByIdAndUpdate(request.user, { role: "admin" });

      // Update request status to approved
      request.status = "approved";
      request.processedBy = processedBy;
      request.processedAt = new Date();
      await request.save();

      res.json({ message: "Admin request approved successfully" });
    } catch (error) {
      console.error("Error approving admin request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Reject admin request (admin only)
  static async rejectRequest(req, res) {
    try {
      const requestId = req.params.id;
      const processedBy = req.user.id;

      const request = await AdminRequest.findOneAndUpdate(
        { _id: requestId, status: "pending" },
        {
          status: "rejected",
          processedBy,
          processedAt: new Date(),
        },
        { new: true }
      );

      if (!request) {
        return res
          .status(404)
          .json({ message: "Request not found or already processed" });
      }

      res.json({ message: "Admin request rejected" });
    } catch (error) {
      console.error("Error rejecting admin request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({})
        .select("firstName lastName email username role status excelRecords chartRecords")
        .sort({ createdAt: -1 });

      // Format the response to match frontend expectations
      const formattedUsers = users.map((user) => ({
        id: user._id,
        firstName: user.firstName || user.username,
        lastName: user.lastName || "",
        email: user.email,
        role: user.role,
        status: user.status,
        fileCount: user.excelRecords?.length || 0,
        chartCount: user.chartRecords?.length || 0 // ✅ ADD THIS LINE
      }));

      res.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get admin details (statistics)
  static async getAdminDetails(req, res) {
    try {
      const adminId = req.user.id;

      const admin = await User.findById(adminId).select("-password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      if (admin.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "User is not an admin",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          createdAt: admin.createdAt,
        },
      });
    } catch (error) {
      console.error("Error fetching admin details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin details",
        error: error.message,
      });
    }
  }

  // Get user files (admin only)
  static async getUserFiles(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const files = user.excelRecords || [];

      const formattedFiles = files.map((file) => ({
        fileId: file._id, // add this
        fileName: file.filename,
        fileSize: file.filesize,
        uploadedAt: file.uploadedAt,
        rows: file.rows,
        columns: file.columns,
      }));

      res.json(formattedFiles);
    } catch (error) {
      console.error("Error fetching user files:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getUserCharts(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const charts = user.chartRecords || [];

      const formattedCharts = charts.map((chart) => ({
        chartType: chart.chartType,
        createdAt: chart.createdAt,
        fromExcelFile: chart.fromExcelFile,
        chartConfig: chart.chartConfig,
      }));

      res.json(formattedCharts);
    } catch (error) {
      console.error("Error fetching user charts:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  // Update user status (e.g., suspend or activate)
  static async updateUserStatus(req, res) {
    try {
      const userId = req.params.userId;
      const { action } = req.body;

      const validActions = ["suspend", "activate"];
      if (!validActions.includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const status = action === "suspend" ? "suspended" : "active";

      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ success: true, message: `User ${action}ed successfully` });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Promote user to admin (only by admin or superadmin)
    static async promoteUser(req, res) {
      try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin" || user.role === "superadmin") {
          return res.status(400).json({ message: "User is already an admin or superadmin" });
        }

        user.role = "admin";
        await user.save();

        res.json({
          success: true,
          message: "User promoted to admin successfully",
          user,
        });
      } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({ message: "Server error" });
      }
    }

    // Remove admin (only by superadmin)
    static async removeAdmin(req, res) {
      try {
        const adminId = req.params.adminId;

        const admin = await User.findById(adminId);
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== 'admin') {
          return res.status(400).json({ message: "User is not an admin" });
        }

        admin.role = 'user';
        await admin.save();

        res.json({
          success: true,
          message: "Admin removed successfully",
        });
      } catch (error) {
        console.error("Error removing admin:", error);
        res.status(500).json({ message: "Server error" });
      }
    }

  static async deleteUserFile(req, res) {
    try {
      const fileId = req.params.fileId;

      // Assuming you store files in user.excelRecords
      const user = await User.findOne({ "excelRecords._id": fileId });
      if (!user) {
        return res.status(404).json({ message: "File/User not found" });
      }

      // Remove the file from the array
      user.excelRecords = user.excelRecords.filter(
        (f) => f._id.toString() !== fileId
      );
      await user.save();

      res.json({ success: true, message: "File deleted successfully" });
    } catch (err) {
      console.error("Error deleting file:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async downloadUserFile(req, res) {
    try {
      const fileId = req.params.fileId;
      const user = await User.findOne({ "excelRecords._id": fileId });
      if (!user) {
        return res.status(404).json({ message: "File/User not found" });
      }

      const file = user.excelRecords.find((f) => f._id.toString() === fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // If you save the file physically
      res.download(file.path, file.filename); // adapt if needed

      // Or if you store contents in DB
      // res.set('Content-Type', 'application/vnd.ms-excel');
      // res.send(file.data);
    } catch (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async viewUserFile(req, res) {
    try {
      const fileId = req.params.fileId;
      const user = await User.findOne({ "excelRecords._id": fileId });
      if (!user) {
        return res.status(404).json({ message: "File/User not found" });
      }

      const file = user.excelRecords.find((f) => f._id.toString() === fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Adjust MIME type if possible
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(file.data);
    } catch (err) {
      console.error("Error viewing file:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = AdminController;
