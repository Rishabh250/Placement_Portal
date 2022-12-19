import facultyRouters  from "../Controllers/FacultyController.js"
import express from "express";

const facultyRouter = express.Router();


//Faculty Create User
facultyRouter.post("/createFaculty", facultyRouters.addNew);

facultyRouter.post("/facultyloginUser", facultyRouters.authorization);

//Get Single User
facultyRouter.get("/facultygetSingleUser", facultyRouters.singleUser);

// Post user Image
facultyRouter.post("/facultyuploadImage", facultyRouters.uploadImage);

//Get Single User Info
facultyRouter.get("/facultyuserInfo", facultyRouters.getUserInfo);

//Get All User Data
facultyRouter.get("/facultygetAllUser", facultyRouters.getAllUser);

//Forget Password
facultyRouter.post("/facultyforgetPassword", facultyRouters.forgetPassword);

//Send OTP
facultyRouter.post("/facultysendOTP", facultyRouters.sendOTP);

//Verify OTP
facultyRouter.post("/facultyverifyOTP", facultyRouters.verifyOTP);

//Faculty Assigned
facultyRouter.post("/facultyAssigned", facultyRouters.assignFaculty);

//Faculty Upload Image
facultyRouter.post("/facultyUploadImage",facultyRouters.uploadImage);

//
facultyRouter.get("/getAssignedEvents",facultyRouters.getAllEvents);


export default facultyRouter;
