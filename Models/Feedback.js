const mongoose = require("mongoose")

const feedbackschema = new mongoose.Schema({
     department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }, sem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sem"
    }, course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }, student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    feedback: [
        {
            question:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'question',
                required: true
            },
            answer: {
                type: String,
                required: true
            },
        },
    ],
    timestamp: { type: Date, default: Date.now },
    year: {
        type: Number,
        default: new Date().getFullYear() 
      },
});

const feedback = mongoose.model("feedback", feedbackschema);
module.exports = feedback;
