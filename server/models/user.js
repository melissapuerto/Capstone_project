const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'IT', 'Finance', 'Marketing', 'Sales'],
        default: 'IT'
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;