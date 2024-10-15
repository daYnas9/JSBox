const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://veejnasvaday7:xKWqCmJaHmc9lPXR@cluster0.vgj9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Define schemas
const AdminSchema = new mongoose.Schema({
    id: {type: String},
    role: {type: String},
    username: {type: String},
    password: {type: String},
});

const UserSchema = new mongoose.Schema({
    id: {type: String},
    role: {type: String},
    username: {type: String},
    password: {type: String},
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    id: {type: String},
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    imageLink: {type: String},
    published: {type: Boolean}
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}