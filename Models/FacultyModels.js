import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt  from "bcrypt";

const facultySchema = new Schema({

    email: { type: String},
    name: { type: String },
    password: { type: String },
    systemID: { type: String},
    type: { type: String },
    gender: { type: String },
    verified : {type : Boolean},

    profileImage: {
        type: String
    },
    otp: { type: Number },
    eventsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events"
    }],
    assignedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events"
    }]


});

facultySchema.methods.comparePassword = function(pass, cb) {
    bcrypt.compare(pass, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
export default mongoose.model("Faculty", facultySchema);