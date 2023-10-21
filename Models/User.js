const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, Enroll: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }, department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }, sem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sem"
    },
    gender: {
        type: String,
        default: "male"
    }, dob: {
        type: Date
    }
});

const user = mongoose.model("user", userschema);
module.exports = user;
