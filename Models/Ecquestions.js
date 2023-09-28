const mongoose = require("mongoose")

const eqschema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    }
});

const eqs = mongoose.model("equestion", eqschema);
module.exports = eqs;
