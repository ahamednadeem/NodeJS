const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/LoginModel');

exports.authenticate = async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Insert a new user record
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword
        });

        res.status(200).send('Successfully inserted new user in table login');
        console.log('Inserted a new record into the login table');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Find user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.warn("Cannot find user with username:", username);
            return res.status(400).send('Cannot find user');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const accessToken = jwt.sign({ name: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
            return res.json({ message: 'Login successful', accessToken });
        } else {
            console.warn("Password does not match for user:", username);
            return res.status(400).send('Incorrect password');
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

exports.validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
