const express = require("express")
const router = express.Router()
const AdminController = require("../controllers/adminControl")
const { verifyToken, isAdmin, isSuperAdmin } = require("../middleware/authMiddleware") // <-- FIX

// Submit admin access request
router.post("/request", verifyToken, AdminController.requestAdminAccess)

// Get all pending admin requests (admin only)
router.get("/requests", verifyToken, isAdmin, AdminController.getPendingRequests)

// Approve admin request (admin only)
router.put("/requests/:id/approve", verifyToken, isAdmin, AdminController.approveRequest)

// Reject admin request (admin only)
router.put("/requests/:id/reject", verifyToken, isAdmin, AdminController.rejectRequest)

router.get('/users', verifyToken, isAdmin, AdminController.getAllUsers)

router.get('/stats', verifyToken, isAdmin, AdminController.getAdminDetails);

router.get("/users/:userId/files", verifyToken, isAdmin, AdminController.getUserFiles);
router.get("/users/:userId/charts", verifyToken, isAdmin, AdminController.getUserCharts);
router.put("/users/:userId", verifyToken, isAdmin, AdminController.updateUserStatus);

router.put("/users/:userId/promote", verifyToken, isAdmin, AdminController.promoteUser);

// New route for removing an admin
router.put("/admins/:adminId/remove", verifyToken, isSuperAdmin, AdminController.removeAdmin);


router.delete('/files/:fileId', verifyToken, isAdmin, AdminController.deleteUserFile);
router.get('/files/:fileId/download', verifyToken, isAdmin, AdminController.downloadUserFile);
router.get('/files/:fileId/view', verifyToken, isAdmin, AdminController.viewUserFile);



module.exports = router