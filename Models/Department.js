const mongoose = require("mongoose")

const Deptschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    hod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: "xxx"
    }

});

const Department = mongoose.model("Department", Deptschema);
module.exports = Department;
