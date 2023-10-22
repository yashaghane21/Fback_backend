const mongoose = require("mongoose")

const Courseschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    sem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sem"
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true

    },
});

const course = mongoose.model("course", Courseschema);
module.exports = course
