const mongoose = require("mongoose")

const semschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }, enabled: {
        type: Boolean,
        default: true
    }
});

const sem = mongoose.model("sem", semschema);
module.exports = sem;
