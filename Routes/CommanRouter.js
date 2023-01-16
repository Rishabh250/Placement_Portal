import express from "express";
import commanCon from "../Controllers/Comman.js";

const commanRouter = express.Router();

commanRouter.post("/resetPassword", commanCon.forgetPassword);

export default commanRouter;
