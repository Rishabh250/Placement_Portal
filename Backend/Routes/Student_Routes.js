import studentRouter  from "../Controllers/Student_Controller.js"
import express from "express";

const stdRouter = express.Router();



stdRouter.get("/student_check_connection",studentRouter.student_check_connection);


stdRouter.post("/studentRegistration",studentRouter.studentRegistration);
stdRouter.post("/studentLogin",studentRouter.studentLogin);
stdRouter.post("/addCourse",studentRouter.addCourse);
stdRouter.post("/addCompany",studentRouter.addCompany);
stdRouter.post("/addInternship",studentRouter.addInternship);
stdRouter.post("/uploadProfilePic",studentRouter.uploadProfilePic);
stdRouter.post("/sendOTP",studentRouter.sendOTP);
stdRouter.post("/verifyOTP",studentRouter.verifyOTP);
stdRouter.get("/getStudentDetails",studentRouter.getStudentDetails);

export default stdRouter;

