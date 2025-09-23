import toast from "react-hot-toast"
import axios from "axios"

const baseurl = import.meta.env.VITE_API_BASE_URL;

export const handleSignup = async (signupData, navigate) => {
  if (signupData.password !== signupData.confirmPassword) {
    toast.error("Passwords do not match")
    return
  }
  try {
    const res = await axios.post(`${baseurl}/api/auth/register`, {
      username: `${signupData.firstName} ${signupData.lastName}`,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role, // Now uses the selected role
    })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("username", res.data.username)
    localStorage.setItem("email", res.data.email)
    localStorage.setItem("role", res.data.role)

    toast.success("Signup Successful!")

    // Redirect based on role
    if (res.data.role === "admin" || res.data.role === "superadmin") {
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }

    return res.data
  } catch (err) {
    console.error(err)
    toast.error(err.response?.data?.error || "Signup failed")
    throw err
  }
}

export const handleLogin = async (loginData, navigate) => {
  try {
    const res = await axios.post(`${baseurl}/api/auth/login`, {
      email: loginData.email,
      password: loginData.password,
    })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("username", res.data.username)
    localStorage.setItem("email", res.data.email)
    localStorage.setItem("role", res.data.role)
    localStorage.setItem("number", res.data.excelRecords.length)

    toast.success("Login Successful!")

    // Redirect based on role
    if (res.data.role === "admin" || res.data.role === "superadmin") { // <-- FIX
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }

    return res.data
  } catch (err) {
    console.error(err)
    toast.error(err.response?.data?.error || "Login failed")
    throw err
  }
}

export const handleGoogleLogin = async (response, navigate) => {
  try {
    const res = await axios.post(`${baseurl}/api/auth/google`, {
      credential: response.credential,
    })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("username", res.data.username)
    localStorage.setItem("email", res.data.email)
    localStorage.setItem("role", res.data.role)
    localStorage.setItem("number", res.data.excelRecords?.length || 0)

    toast.success("Google Login Successful!")

    // Redirect based on role
    if (res.data.role === "admin" || res.data.role === "superadmin") { // <-- FIX
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }

    return res.data
  } catch (err) {
    console.error(err)
    toast.error(err.response?.data?.error || "Google login failed")
    throw err
  }
}

export const handleSignOut = async (navigate) => {
  try {
    localStorage.clear()
    navigate("/")
  } catch (err) {
    console.log(err)
  }
}

// ... (rest of the file remains the same)
export const uploadExcelFile = async (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append("excelFile", file)

  const token = localStorage.getItem("token")

  try {
    const response = await axios.post(`${baseurl}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress,
    })

    console.log("File uploaded successfully, server response:", response.data)
    return response.data
  } catch (error) {
    console.error("Upload API error:", error)
    const errorMessage = error.response?.data?.message || error.message || "Upload failed"
    throw new Error(errorMessage)
  }
}

export const saveChartConfig = async ({ chartType, fromExcelFile, chartConfig, token }) => {
  const response = await axios.post(
    '/api/chart/save',
    { chartType, fromExcelFile, chartConfig },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token")
  const response = await axios.get(`${baseurl}/api/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token")
  const response = await axios.put(`${baseurl}/api/user/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const requestAdminAccess = async ({ reason, experience }) => {
  const token = localStorage.getItem("token")
  const response = await axios.post(
    `${baseurl}/api/user/admin-request`,
    { reason, experience },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

// Get admin requests (for admin users)
export const getAdminRequests = async () => {
  const token = localStorage.getItem("token")
  const response = await axios.get(`${baseurl}/api/admin/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Approve admin request
export const approveAdminRequest = async (requestId) => {
  const token = localStorage.getItem("token")
  const response = await axios.put(
    `${baseurl}/api/admin/requests/${requestId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

// Reject admin request
export const rejectAdminRequest = async (requestId) => {
  const token = localStorage.getItem("token")
  const response = await axios.put(
    `${baseurl}/api/admin/requests/${requestId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}