import mongoose from "mongoose";
const Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        name : {type : String},
        password : {type:String,required:true},
        email : {type : String,required:true,unique:true},
        systemID : {type : String,required:true,unique:true},
        department : {type : String,required:true},
        year : {type : String,required:true},
        semester : {type : String,required:true},
        placement : {type : String},
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