const express = require("express")
const router = express.Router();
const qmodel = require("../Models/Questions")
const cmodel = require("../Models/Course")
const fmodel = require("../Models/Feedback")
const umodel = require("../Models/User")
const ecfmodel = require("../Models/Ecquestions")
const ecmodel = require("../Models/ECfback")


router.get("/ques", async (req, res) => {
    try {
        const questions = await qmodel.find({})
        const t = await qmodel.find({}).count()

        return res.status(200).send({
            success: true,
            questions, t
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
})

router.post("/subjectsq", async (req, res) => {
    try {
        const { sem } = req.body;
        const subjects = await cmodel.find({ sem: sem });
        console.log(subjects);
        return res.status(200).send({
            subjects,
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
});


router.post("/subjects", async (req, res) => {
    try {
        const { sem } = req.body;
        console.log(sem)
        const subjects = await cmodel.find({ sem: sem }).populate("teacher");
        console.log(subjects);
        return res.status(200).send({
            subjects,
            success: true
        });
    } catch (error) {
        //console.log(error)
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
});



router.post('/feedback', async (req, res) => {
    const { feedback, subject, department, sem, course, student } = req.body;

    try {
        const newFeedback = new fmodel({ department, sem, course, student, feedback });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});




router.post("/user", async (req, res) => {
    const { id } = req.body
    const user = await umodel.findById(id).populate("sem")
    return res.status(200).send({
        user
    })
})

router.get("/ecques", async (req, res) => {
    try {
        const questions = await ecfmodel.find({})
        const t = await ecfmodel.find({}).count()

        return res.status(200).send({
            success: true,
            questions, t
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
})



router.post('/ecfeedback', async (req, res) => {
    const { feedback, department, student } = req.body;

    try {
        const newFeedback = new ecmodel({ department, student, feedback });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});

module.exports = router;