const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors")
require('dotenv').config();




const auth = require("./Routers/Auth")
const student = require("./Routers/student")
const hod = require("./Routers/Hod")


app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://gpmfeedback.netlify.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());

app.use("/api/v1", auth)
app.use("/api/v2", hod)
app.use("/api/v3", student)




const mongoUrl = process.env.MONGODB_URL;
console.log(process.env.MONGODB_URL)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });





app.listen(3000, () => {
  console.log(" server is running");
});
