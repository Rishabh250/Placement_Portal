import mongoose from "mongoose";
const Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        name : {type : String},
        password : {type:String,required:true},
        phoneNo : {type:String,required:true},
        email : {type : String,required:true,},
        systemID : {type : String,required:true,},
        department : {type : String},
        year : {type : String},
        semester : {type : String},
        placement : {type : String},
        userType : {type :String },
        accountVerified : {type : Boolean},
        courses : [
            {
                school : {type : String},
                course : {type : String},
                startYear : {type : String},
                endYear : {type : String},
                percentage : {type : String},
            }
        ],
        internships : [
            {
                company : {type : String},
                companyLocation : {type : String},
                position : {type : String},
                start : {type : String},
                end : {type : String},
                certificate : {type : String},
            }
        ],
         company : [
            {
                company : {type : String},
                companyLocation : {type : String},
                position : {type : String},
                start : {type : String},
                end : {type : String},
                certificate : {type : String},
            }
        ],
        profilePic : {data : {type : Buffer}},
        otp : {type : String},
        otpExpireTime : {type : String},

       

    }
);



export default mongoose.model("Student",StudentSchema);