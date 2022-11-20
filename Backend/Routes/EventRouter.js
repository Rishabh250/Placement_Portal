import eventRouters  from "../Controllers/EventController.js"
import express from "express";

const eventRouter = express.Router();

//Create Event
eventRouter.post("/createEvent", eventRouters.createEvent);

//Get Events
eventRouter.get("/getPlacementEvents", eventRouters.getPlacementEvents);
eventRouter.get("/getGeneralEvents", eventRouters.getGeneralEvents);
eventRouter.get("/getAllEvents/eventTitle=:title", eventRouters.getAllEvents);

//Store Rounds
eventRouter.post("/createRound", eventRouters.createRounds);

//Selected Students or Attendence
eventRouter.post("/selectedStudents", eventRouters.selectedStudends);

//Event Round
eventRouter.post("/getEventRound", eventRouters.getEventRound);

//Single Round
eventRouter.post("/getSingleRound", eventRouters.getSingleRound);

//Close Event
eventRouter.post("/closeEvent", eventRouters.closeEvent);
eventRouter.post("/closeRegistration", eventRouters.closeRegistration);
eventRouter.post("/openRegistration", eventRouters.openRegistration);

//Get unselected students 
eventRouter.post("/getUnselectedStudents",eventRouters.getUnselectedStudents);

//Get particular events
eventRouter.post("/getSelectedEvents",eventRouters.getSelectedEvents);


//Single Event
eventRouter.post("/singleEvent",eventRouters.singleEvent);

//
eventRouter.post("/singleEventFaculty",eventRouters.eventsFacultyAssigned);




export default eventRouter;
