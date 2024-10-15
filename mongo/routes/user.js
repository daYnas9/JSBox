const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) {
            res.status(404).josn({
                success: false,
                message: 'Username or password is missing'
            })
        }

        const id = await User.estimatedDocumentCount() + 1;
        await User.create({id, username, password}); 
        res.status(200).json({
            message: 'User created successfully'
        })
    } catch(e) {
        res.status(400).json({
            success: false,
            message: 'Signup Error'
        })
    }
});

router.get('/courses', async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!ussername || !password) {
            res.status(400).send({
                success: false,
                message: 'Username or Password is missing'
            })
        }

        const courses = await Course.find();
        res.status(200).json({courses})
    } catch(e) {

    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    try {
        const id = req.params.courseId;
        const {username, password} = req.body;
        const isCoursePresent = await Course.findOne({id});
        if(!isCoursePresent) {
            res.status(400).json({
                success: false,
                message: 'Course not present in course list'
            })
        }

        await User.updateOne(
            { username },
            {
                "$push": {
                    purchasedCourses: courseId
                }
            }
        )
        
        res.status(isCoursePresent ? 200 : 400).json({
            success: isCoursePresent,
            message: isCoursePresent ? 'Course purchased successfully' : 'Course not present in course list'
        })
    } catch(e) {
        res.status(400).json({
            success: false,
            message: 'Error occurred while fetching courses'
        })
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    try {
        // user profile --> courseId --> filter
        const { username, password } = req.headers;
        const user = await User.findOne({username});
        const purchasedCoursedId = user.purchasedCourses;
        
        const purchasedCourses = await Course.find({
            _id: {
                "$in": purchasedCoursedId
            }
        })

        res.status(200).json({ purchasedCourses })
    } catch(e) {
        res.status(400).json({ success: false, message: 'Failed to fetch courses'})
    }
});

module.exports = router