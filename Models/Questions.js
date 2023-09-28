const mongoose = require("mongoose")

const qschema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    }
});

const qs = mongoose.model("question", qschema);
module.exports = qs;
