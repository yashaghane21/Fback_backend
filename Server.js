const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors")
// app.use(cors());


const auth = require("./Routers/Auth")
const student = require("./Routers/student")
const hod = require("./Routers/Hod")


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());

app.use("/api/v1", auth)
app.use("/api/v2", hod)
app.use("/api/v3", student)


const mongoDB = "mongodb+srv://bytedevs2121:ckE8KmiAgfTst4AO@cluster0.szpyuui.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(" Database coonection succsess");
  })
  .catch((e) => {
    console.log(e);
  });





app.listen(3000, () => {
  console.log(" server is running");
});
