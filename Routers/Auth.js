const express = require("express")
const router = express.Router();
const usermodel = require("../Models/User")
const JWT_SECRET = "yadgshdgjfrurfg"
const validator = require("validator")
const deptmodel = require("../Models/Department")
const semmodel = require("../Models/Sem")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

router.post("/register", async (req, res) => {                                // http://localhost:5000/api/v3/register
    const { name, email, Enroll, password, phone, department, sem } = req.body

    if (!validator.isEmail(email) || !validator.isLength(email, { min: 3, max: 320 })) {
        return res.status(400).send({
            success: false,
            message: "Invalid email"
        });
    }
    if (!validator.isLength(phone, { min: 10, max: 10 })) {
        return res.status(400).send({
            success: false,
            message: "Phone number should be 10 digits"
        });
    }
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).send({
            success: false,
            message: "password shoul be at least 6 digits"
        });
    }

    const suser = await usermodel.findOne({ email })
    if (suser) {
        return res.status(400).send({
            success: false,
            message: "user already exist"
        })
    }

    const hashedpass = await bcrypt.hash(password, 10)
    const user = new usermodel({ name, email, Enroll, password: hashedpass, phone, department, sem });
    const userd = await user.save();
    const subject = "About"
    const text = "welocome to feedbacker"

    var mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
        }
    });

    return res.status(200).send({
        success: true,
        message: "done",
        user: userd,


    })


}

);

router.post("/login", async (req, res) => {               // http://localhost:5000/api/v3/login
    try {
        const { password, email } = req.body;
        //validation
        if (!password | !email) {
            return res.status(401).send({
                success: false,
                message: "Please provide  password",
            });
        }
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email is not registerd",
            });
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invlid email  or password",
            });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d"
        });
        return res.status(200).send({
            success: true,
            messgae: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                Enroll: user.Enroll,
                password: user.password,
                phone: user.phone,
                department: user.department,
                sem: user.sem,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Login Callcback",
            error,
        });
    }
}
);


router.get("/department", async (req, res) => {
    const departments = await deptmodel.find({}).populate("hod")
    return res.status(200).send({
        success: true,
        message: "done",
        departments
    })
})


router.post("/getsembydep", async (req, res) => {
    const { dep } = req.body
    const sems = await semmodel.find({ department: dep });
    return res.status(200).send({
        success: true,
        message: "done",
        sems
    });
});






module.exports = router