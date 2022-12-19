import express from 'express';
import bodyParser from 'body-parser';
import connection from "./public/DB_Connection/DB_Connection.js";
import studentrouter from "./Routes/Student_Routes.js"
import multer from 'multer';
import eventRouter from './Routes/EventRouter.js';
import facultyRouter from './Routes/FacultyRouter.js';
const app = express();
connection();
let Port = process.env.PORT || 2504;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/student", studentrouter)
app.use("/faculty", facultyRouter)
app.use("/events", eventRouter)


app.listen(Port, () => { console.log(`Server Connected to Port : ${Port}`); })

app.get("/", (req, res) => {
    return res.send("Connected");
});

var storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    },
});

var upload = multer({
    storage: storage,
}).single("profilePic");

export default upload;