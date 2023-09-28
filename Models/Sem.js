const mongoose = require("mongoose")

const semschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
});

const sem = mongoose.model("sem", semschema);
module.exports = sem;
