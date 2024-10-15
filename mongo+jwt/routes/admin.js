const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { User, Course }  = require('../db')
const jwtAuthKey = 'This is JWT auth key';

function getHashedPassword(password) {

}

function getToken({username, password}) {
    const token = jwt.sign({username, password}, jwtPassword);
    return token;
}

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            res.status(400).json({error: 'Username or password is missing'})
        }

        const isExistingUser = await User.findOne({username});
        if(isExistingUser) {
            res.status(400).json({error: 'User already exists'});
        }

        const hashedPassword = getHashedPassword(password);
        const newUser = await User.create({username, password: hashedPassword});
        res.status(201).json({
            message: 'Admin created successfully.'
        })
    } catch(e) {
        res.status(500).json({error: 'Error occured while signing up'})
    }
});

router.post('/signin', (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) res.status(400).json({error: 'Username or password is missing'})

        const user = User.findOne({username, password});
        if(!user) res.status(400).json({error: 'Invalid Credentials'});
        const token = jwt.sign({username}, jwtAuthKey);
        res.status(200).json({token});
    } catch(e) {
        res.status(500).json({error: 'Error occured while signing in'})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
   try {
    const { title, description, price, imageLink } = req.body;
    const id = await Course.estimatedDocumentCount() + 1;
    await Course.create({ id, title, description, price, imageLink})
    res.status(200).json({
        message: 'Course created successfully', courseId: id
    })
    } catch(e) {
        res.status(400).json({
            error: 'Error occured while creating new course'
        })
   } 
});

router.get('/courses', adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find({}); 
        res.status(200).json({courses})
    } catch(e) {
        res.status(400).json({error: 'Error occured while fetching courses'})
    }
});

module.exports = router;