const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true    
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [3, 'Password must be at least 3 characters long']
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);