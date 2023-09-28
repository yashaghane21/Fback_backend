const express = require("express")
const router = express.Router();
const departmentmodel = require("../Models/Department")
const semmodel = require("../Models/Sem")
const coursemodel = require("../Models/Course")
const qmodel = require("../Models/Questions");
const fmodel = require("../Models/Feedback");
const teachmodel = require("../Models/Teacher")
const usermodel = require("../Models/User")
const ecfmodel = require("../Models/Ecquestions")
// const fmodel = require("../Models/Feedback")

router.post("/department", async (req, res) => {
    try {
        const { name, hod } = req.body
        const dept = new departmentmodel({ name, hod });
        await dept.save();
        return res.status(200).send({
            success: true,
            message: "Department created successfully",
            dept
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message // You can access the error message using error.message
        });
    }
});

router.post("/sem", async (req, res) => {
    try {
        const { name, department } = req.body;
        const sem = new semmodel({ name, department });
        await sem.save();

        return res.status(200).send({
            success: true,
            message: "Semester created successfully",
            sem
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
});

router.post("/course", async (req, res) => {
    try {
        const { name, department, sem, teacher } = req.body
        const course = new coursemodel({ name, department, sem, teacher });
        const savedCourse = await course.save();

        return res.status(200).send({
            success: true,
            message: "Course created successfully",
            savedCourse
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
});


router.post("/question", async (req, res) => {
    try {
        const { question } = req.body
        const questions = new qmodel({ question });
        await questions.save();
        return res.status(200).send({
            success: true,
            questions
        })

    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
})

router.get("/feedback/:sem", async (req, res) => {
    const { sem } = req.params
    const feedback = await fmodel.find({ sem: sem }).populate("student").populate("course")
    return res.status(200).send({
        feedback
    })
})


router.post("/feedbacksub", async (req, res) => {
    const { sub } = req.body
    const feedback = await fmodel.find({ course: sub }).populate("student").populate("course")
    return res.status(200).send({
        feedback
    })
})




router.get("/countf", async (req, res) => {
    const tfeedbacks = await fmodel.find({}).count()
    return res.status(200).send({
        tfeedbacks
    })
})

router.get("/countsA/:sem", async (req, res) => {
    const sem = req.params.sem;
    const tfeedbacks = await fmodel.find({ sem }).count();
    return res.status(200).send({
        tfeedbacks
    });
});

router.get("/sems/:dep", async (req, res) => {
    const { dep } = req.params
    const sems = await semmodel.find({ department: dep });
    return res.status(200).send({
        sems
    })
})


router.get("/feedbackby/:dep", async (req, res) => {
    const { dep } = req.params;
    try {
        const feedback = await fmodel.find({ department: dep }).populate("student").populate("course");
        const goodfeedbacks = await fmodel.find({ "feedback.answer": "good" })
        const totalgood = await fmodel.find({ "feedback.answer": "good" }).count()
        const totalaverage = await fmodel.find({ "feedback.answer": "average" }).count()
        const totalBaverage = await fmodel.find({ "feedback.answer": "below average" }).count()
        return res.status(200).send({
            feedback,
            goodfeedbacks,
            totalgood,
            totalaverage,
            totalBaverage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
});

;
// router.get("/countf", async (req, res) => {
//     const tfeedbacks = await fmodel.find({feedback.answer == "good"}).count()
//     return res.status(200).send({
//         tfeedbacks
//     })
// })


router.get("/fback/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const fback = await fmodel.findById(id).populate("student").populate("course").populate("feedback.question");

        if (!fback) {
            return res.status(404).send({
                message: "Feedback not found"
            });
        }

        return res.status(200).send({
            fback
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
});



router.post("/addfac", async (req, res) => {
    try {
        const { name, email, phone, education, department } = req.body
        const nteacher = new teachmodel({ name, email, phone, education, department });
        await nteacher.save();
        return res.status(200).send({
            success: true,
            nteacher
        })
    } catch (error) {
    }
});

router.post("/fac", async (req, res) => {
    try {
        const { dep } = req.body
        const teachers = await teachmodel.find({ department: dep });

        return res.status(200).send({
            success: true,
            teachers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            error: "Internal Server Error"
        });
    }
});


router.get("/fac/:id", async (req, res) => {
    try {
        const { id } = req.params
        const teachers = await teachmodel.findById(id)
        return res.status(200).send({
            success: true,
            teachers
        })

    } catch (error) {

    }
})


router.post("/searchfac", async (req, res) => {
    try {
        const { search } = req.body;
        const result = await teachmodel.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
                { education: { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        });

        console.log(result)
        return res.status(200).send({
            success: true,
            result
        })

    } catch (error) {

    }
})


router.post("/subjects", async (req, res) => {
    const { dep } = req.body
    const subjects = await coursemodel.find({ department: dep }).populate("teacher")
    return res.status(200).send({
        success: true,
        subjects
    })
})



router.put("/uteacher", async (req, res) => {
    const { value, id } = req.body
    const ut = await coursemodel.findByIdAndUpdate(id, {
        teacher: value
    });
    return res.status(200).send({
        success: true,
        ut
    })
});


router.post("/getsubbysem", async (req, res) => {
    const { sem } = req.body
    const subjects = await coursemodel.find({ sem: sem }).populate("teacher");
    return res.status(200).send({
        subjects
    })
})



router.post("/searchsub", async (req, res) => {
    try {
        const { search } = req.body;
        const result = await coursemodel.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },

            ]
        }).populate("teacher");

        console.log(result)
        return res.status(200).send({
            success: true,
            result
        })

    } catch (error) {

    }
})

router.get("/students", async (req, res) => {
    const students = await usermodel.find({ role: 0 });
    return res.status(200).send({
        students
    })
})


router.post("/stubysem", async (req, res) => {   //students by seme
    const { sem } = req.body
    const students = await usermodel.find({ role: 0, sem: sem });
    return res.status(200).send({
        students
    })
})


router.post("/updstusem", async (req, res) => {
    const { osem, nsem } = req.body
    const up = await usermodel.updateMany(
        { sem: osem },
        { $set: { sem: nsem } }
    )
    return res.status(200).send({
        up,
        success: true
    })
})


router.post("/searchstud", async (req, res) => {
    try {
        const { search } = req.body;
        const result = await usermodel.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: ".*" + search + ".*", $options: "i" } },
                        { Enroll: { $regex: ".*" + search + ".*", $options: "i" } },
                        { email: { $regex: ".*" + search + ".*", $options: "i" } }
                    ]
                },
                { role: 0 }
            ]
        });


        console.log(result)
        return res.status(200).send({
            success: true,
            result
        })

    } catch (error) {

    }
})

router.get("/getdata", async (req, res) => {
    const totalstudents = await usermodel.find({ role: 0 }).count();
    const tfeedbacks = await fmodel.find({}).count()
    const tteacher = await teachmodel.find({}).count()
    return res.status(200).send({
        totalstudents,
        tfeedbacks,
        tteacher
    })
})

router.delete("/qdel/:id", async (req, res) => {
    const { id } = req.params
    const response = await qmodel.findByIdAndDelete(id)
    return res.status(200).send({
        response,
        success: true
    })
});

router.post("/ecquestion", async (req, res) => {
    try {
        const { question } = req.body
        const questions = new ecfmodel({ question });
        await questions.save();
        return res.status(200).send({
            success: true,
            questions
        })

    } catch (error) {
        return res.status(400).send({
            success: false,
            error: error.message
        });
    }
})


router.delete("/ecqdel/:id", async (req, res) => {
    const { id } = req.params
    const response = await ecfmodel.findByIdAndDelete(id)
    return res.status(200).send({
        success: true,
        response,
      
    })
});
module.exports = router;
