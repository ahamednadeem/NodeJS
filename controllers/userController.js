const { Sequelize } = require('sequelize'); // Add this line

const User = require('../models/UserModel');
const userValidations = require('../validations/userValidations');

// View users
exports.view = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log('The data from user table: \n', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Find user by Search
exports.find = async (req, res) => {
    try {
        const searchTerm = req.body.name;
        const users = await User.findAll({
            where: {
                name: { [Sequelize.Op.like]: `%${searchTerm}%` }
            }
        });
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found matching the search term' });
        }
        console.log('The data from user table: \n', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add new user
exports.create = async (req, res) => {
    const { name, email, phone } = req.body;

    // Check if a user with the same email or phone already exists
    const existingUser = await User.findOne({
        where: {
            [Sequelize.Op.or]: [{ email }, { phone }]
        }
    });

    if (existingUser) {
        return res.status(400).json({ error: 'User with the same email or phone already exists' });
    }

    // If no existing user found, proceed to create the new user
    const errors = userValidations.validateUserInput(name, email, phone);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try {
        const newUser = await User.create({ name, email, phone });
        console.log('User added successfully:', newUser);
        res.status(200).json({ message: 'User added successfully', userId: newUser.id });
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update User
exports.update = async (req, res) => {
    const { name, email, phone } = req.body;
    const errors = userValidations.validateUserInput(name, email, phone);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }
    try {
        const [updatedRowsCount, updatedUser] = await User.update({ name, email, phone }, {
            where: { id: req.params.id },
            returning: true // Return the updated user
        });
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User updated successfully:', updatedUser);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete User
exports.delete = async (req, res) => {
    try {
        const deletedRowCount = await User.destroy({ where: { id: req.params.id } });
        if (deletedRowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User deleted successfully:', req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// View user by ID
exports.viewById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User retrieved successfully:', user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};