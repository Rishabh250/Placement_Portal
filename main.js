import bodyParser from "body-parser";
import Cors from "cors";
import express from "express";
import multer from "multer";
import connection from "./public/DB_Connection/DB_Connection.js";
import commanRouter from "./Routes/CommanRouter.js";
import eventRouter from "./Routes/EventRouter.js";
import facultyRouter from "./Routes/FacultyRouter.js";
import studentrouter from "./Routes/Student_Routes.js";
const app = express();
connection();
let Port = process.env.PORT || 2504;

app.use(Cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/student", studentrouter);
app.use("/faculty", facultyRouter);
app.use("/events", eventRouter);
app.use("/", commanRouter);

app.listen(Port, () => {
  console.log(`Server Connected to Port : ${Port}`);
});

app.get("/", (req, res) => {
  return res.send("Connected");
});

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("profilePic");

export default upload;
