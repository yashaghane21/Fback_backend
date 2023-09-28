const mongoose = require("mongoose")

const ecfschema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    } , student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    feedback: [
        {
            question:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'equestion',
                required: true
            },
            answer: {
                type: String,
                required: true
            },
        },
    ],
    timestamp: { type: Date, default: Date.now },
});

const ecf = mongoose.model("ecf", ecfschema);
module.exports = ecf;
