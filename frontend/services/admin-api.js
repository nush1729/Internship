import toast from "react-hot-toast"
import axios from "axios"

const baseurl = import.meta.env.VITE_API_BASE_URL;

// Get admin statistics
export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    toast.error("Failed to fetch admin statistics")
    throw error
  }
}

// Get all users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    toast.error("Failed to fetch users")
    throw error
  }
}

// Promote user to admin
export const promoteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${baseurl}/api/admin/users/${userId}/promote`,
      {}, // no body needed
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("User promoted to admin successfully");
    return response.data;
  } catch (error) {
    console.error("Error promoting user:", error);
    toast.error("Failed to promote user");
    throw error;
  }
};


// Suspend user account
export const suspendUser = async (userId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.put(
      `${baseurl}/api/admin/users/${userId}/suspend`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    )
    toast.success("User suspended successfully")
    return response.data
  } catch (error) {
    console.error("Error suspending user:", error)
    toast.error("Failed to suspend user")
    throw error
  }
}

// Activate user account
export const activateUser = async (userId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.put(
      `${baseurl}/api/admin/users/${userId}/activate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    )
    toast.success("User activated successfully")
    return response.data
  } catch (error) {
    console.error("Error activating user:", error)
    toast.error("Failed to activate user")
    throw error
  }
}

// Get all files across the system
export const getAllFiles = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/files`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching files:", error)
    toast.error("Failed to fetch files")
    throw error
  }
}

// Get all charts across the system
export const getAllCharts = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/charts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching charts:", error)
    toast.error("Failed to fetch charts")
    throw error
  }
}

// Delete user account
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.delete(`${baseurl}/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    toast.success("User deleted successfully")
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    toast.error("Failed to delete user")
    throw error
  }
}

// Get user activity logs
export const getUserActivityLogs = async (userId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/users/${userId}/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching user activity:", error)
    toast.error("Failed to fetch user activity")
    throw error
  }
}

// Get system activity logs
export const getSystemActivityLogs = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${baseurl}/api/admin/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching system activity:", error)
    toast.error("Failed to fetch system activity")
    throw error
  }
}
