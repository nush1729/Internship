const User = require('../models/User');

// REASON: This function fetches all users from the database, excluding their passwords for security.
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// REASON: This function handles deleting a user by their ID.
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.deleteOne();
    res.json({ msg: 'User removed successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};