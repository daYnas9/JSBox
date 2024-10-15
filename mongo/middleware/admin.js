const bcrypt = require('bcrypt');
const { Admin } = require('../db'); 

async function matchPassword(enteredPassword, password) {
    return await bcrypt.compare(enteredPassword, password);
}

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try {
        const { username, password } = req.headers;
        const user = await Admin.findOne({ username }).select('+password');
        if(!user) return res.status(400).json({success: false, error : `User doesn't exists`});
        const isValidUser = await matchPassword(password, user.password); 
        if(!isValidUser) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credentials'
            })
        }
        next();
    } catch(e) {
        return res.status(400).json({
            success: false,
            error: 'Authentication Error'
        });
    }

}

module.exports = adminMiddleware;