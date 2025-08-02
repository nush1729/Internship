// Example: Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT or other auth here if needed

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email
    },
    // token: jwtToken
  });
};
