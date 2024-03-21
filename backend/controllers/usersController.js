const User = require('../models/User');
const Interview = require('../models/Interview');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, email, permissions } = req.body;

    // Confirm data
    if (!username || !password || !email || !Array.isArray(permissions) || !permissions.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);
    
    const userObject = { username, "password": hashedPwd, email, permissions }

    // Create and store new user
    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    };
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, email, permissions, active } = req.body;

    // Confirm data
    if (!id || !username || !Array.isArray(permissions) || !permissions.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the user exist
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.permissions = permissions;
    user.active = active;
    user.email = email;

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete new user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Store user details for reply
    const { username, _id } = user;

    // Delete the user
    const result = await User.deleteOne({ _id });

    if (result.deletedCount !== 1) {
        return res.status(500).json({ message: 'Error deleting user' });
    } else {
        res.json(`Username ${username} with ID ${_id} deleted`);
    }
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};
   