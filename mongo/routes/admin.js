const { Router } = require("express");
const bcrypt = require('bcrypt');
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require('../db'); 

async function getHashedPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch(e) {
        console.log('Error occured while hashing password.')
    }
}

// Admin Routes
router.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.headers;

        const existingUser = await Admin.findOne({username});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists.'
            });
        } 

        const id = await Admin.estimatedDocumentCount() + 1;
        const hashedPassword = await getHashedPassword(password);
        const adminUser = new Admin({id, role: 'admin', username, password: hashedPassword});
        await adminUser.save();
        
        res.status(200).json({
            message: 'Admin created successfully'
        })
    } catch(e) {
        res.status(400).json({
            success: false,
            error: 'Error occured while creating user'
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    try {
        const { title, description, price, imageLink } = req.body;
        const id = await Course.estimatedDocumentCount() + 1;
        const course = new Course({id, title, description, price, imageLink, published: true});
        await course.save();
        res.status(200).json({
            message: 'Course created successfully',
            courseId: 'new course id'
        })
    } catch(e) {
        res.status(400).json({
            success: 'false',
            message: 'Error occured while creating course'
        })
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({courses})
    } catch(e) {
        res.status(400).json({
            success: false,
            message: 'Error occured while fetching courses',
        })
    }
});

module.exports = router;