import mongoose from "mongoose";
var Schema = mongoose.Schema;
import bcrypt  from "bcrypt";


var eventSchema = new Schema({
    title: { type: String },
    type: { type: String },
    status: { type: String },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    registration : {type : Boolean},
    eventPrice: { type: String },
    facultyAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    appliedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],  
    
    studentLeft: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],

    rounds: [{

        roundNumber: { type: Number },
        status :{type : String},
        lab: { type: String },
        testType: { type: String },
        date: { type: String },
        time: { type: String },
        lastRound: { type: Boolean },
        showQRCode : {type : Boolean},

        totalStudent : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }],

        unselectedStudends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }],
        selectedStudends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }],

        absent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }],
        present: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }]
    }],
    createdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }]

});



export default mongoose.model("Events", eventSchema);