import Student from "../Models/Student_Model.js";
import bcrypt, { hash } from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import keys from "../public/Private/private_keys.js";
import upload from "../main.js"
import sendMail from "../public/EmailServide.js"

var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

    const getStudent = async(token)=>{
        var decode = jwt.verify(token,keys.TOKEN_KEY);
        var findStudent = await Student.findOne({email : decode.email});

        return findStudent;
  }

    const generateRandomNumber = ()=>{
        var randVal = 10000+(Math.random()*(99999-10000));
        return Math.round(randVal);  
    }

    const hashContent = (content)=>{
        var hash = bcrypt.hashSync(content,10);
        console.log(hash);
        return hash;
    }
    
var studentRouter = {


    student_check_connection : async(req,res)=>{
        return res.status(200).json({msg : "Connected with Student API"})
    },

    studentRegistration : async(req,res)=>{
        try {
            if(!req.body.name){
                return res.status(404).json({msg : "Field can't be empty"});
            }

            
            var password = req.body.password;

            password =  hashContent(password);

            var createStudent  = Student({
                name : req.body.name,
                email : req.body.email,
                password : password,
                systemID : req.body.systemID,
                department : req.body.department,
                year : req.body.year,
                semester : req.body.semester,
                profilePic : req.body.profilePic
            
            });
            
            
          
            var token =  jwt.sign({ email: req.body.email }, keys.TOKEN_KEY);
            var createStudent =   await Student.create(createStudent);
            
    
            return res.status(200).json({student : createStudent, token : token})
                  

            
            
        } catch (error) {
            console.log(`Student Registration ${error}`);
            return res.status(400).json({studentRegistrationError : error})

        }
    },

    studentLogin : async(req,res)=>{
        if(!req.body.email || !req.body.password){
            return res.status(404).json({msg : "Field can't be empty"});

        }

        try {
            
            let findStudent = await Student.findOne({email:req.body.email});

            if(findStudent){

            bcrypt.compare(req.body.password,findStudent.password,(err,result)=>{
                if(result){
                    var token = jwt.sign({
                        email : findStudent.email
                    },keys.TOKEN_KEY)
                    return res.status(200).json({token:token,student : findStudent});
                }
                else{
                    return res.status(401).json({msg : "Wrong Password"});
                }
            });

           
            }
            else{
                return res.status(404).json({msg : "No Student found"});

            }


        } catch (error) {
            console.log(`Student Login Error ${error}`);
            return res.status(404).json({studentLoginError : error});

        }
    },

    getStudentDetails : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(401).json({msg : "Need Token"});
            }
            var token = req.headers["sharda-access-token"];
    
            var decodeToken = jwt.verify(token,keys.TOKEN_KEY);
    
            var findStudent = await Student.findOne({email : decodeToken.email});
    
            if(findStudent){
                return res.status(200).json({"Student" :findStudent });
            }
            else{
                return res.status(404).json({msg :"No Student Found"});
                
            }   
        } catch (error) {
            console.log(`Student Registration ${error}`);
            return res.status(200).json({getstudentdetails : error})
        }

    },

    addCourse : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(401).json({msg : "Need Token"});
            }
            var token = req.headers["sharda-access-token"];
            var courses = 
                {
                    school :req.body.school , 
                    course :req.body.course , 
                    startYear :req.body.startYear , 
                    endYear :req.body.endYear , 
                    percentage :req.body.percentage 
                }            
    
            var decodeToken = jwt.verify(token,keys.TOKEN_KEY);
    
            var findStudent = await Student.findOne({email : decodeToken.email});
    
            if(findStudent){

               try {
                    findStudent.courses.push(courses);
                    findStudent.save();
                    return res.status(200).json({msg : "Course Add",student : findStudent});
               } catch (error) {
                    return res.status(403).json({"Course Add Error" : error})
                
               }

             
            }
            else{
                return res.status(404).json({msg :"No Student Found"});
                
            }   
        } catch (error) {
            console.log(`Student Registration ${error}`);
            return res.status(404).json({getstudentdetails : error})
        }

    },
    
    addInternship : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(401).json({msg : "Need Token"});
            }
            var token = req.headers["sharda-access-token"];
            var internships ={
                company : req.body.company,
                companyLocation : req.body.companyLocation,
                position : req.body.position,
                start : req.body.start,
                end : req.body.end,
                certificate : req.body.certificate,
             }           
    
            var decodeToken = jwt.verify(token,keys.TOKEN_KEY);
    
            var findStudent = await Student.findOne({email : decodeToken.email});
    
            if(findStudent){

               try {
                    findStudent.internships.push(internships);
                    findStudent.save();
                    return res.status(200).json({msg : "Interniship Add",student : findStudent});
               } catch (error) {
                    return res.status(403).json({"Interniship Add Error" : error})
                
               }

             
            }
            else{
                return res.status(404).json({msg :"No Student Found"});
                
            }   
        } catch (error) {
            console.log(`Student Registration ${error}`);
            return res.status(404).json({getstudentdetails : error})
        }

    },
    
    addCompany : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(401).json({msg : "Need Token"});
            }
            var token = req.headers["sharda-access-token"];
            var company = {
                company : req.body.company,
                companyLocation : req.body.companyLocation,
                position : req.body.position,
                start : req.body.start,
                end : req.body.end,
                certificate : req.body.certificate,
             }
    
            var decodeToken = jwt.verify(token,keys.TOKEN_KEY);
    
            var findStudent = await Student.findOne({email : decodeToken.email});
    
            if(findStudent){

               try {
                    findStudent.company.push(company);
                    findStudent.save();
                    return res.status(200).json({msg : "Company Add",student : findStudent});
               } catch (error) {
                    return res.status(403).json({"Company Add Error" : error})
                
               }

             
            }
            else{
                return res.status(404).json({msg :"No Student Found"});
                
            }   
        } catch (error) {
            console.log(`Student Registration ${error}`);
            return res.status(404).json({getstudentdetails : error})
        }

    },
    
    uploadProfilePic : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(401).json({msg : "Need Token"});
            }
            var token = req.headers["sharda-access-token"];
    
            var decodeToken = jwt.verify(token,keys.TOKEN_KEY);
    
            var findStudent = await Student.findOne({email : decodeToken.email});

            if(findStudent){

                upload(req,res,async (err)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        if(req.file){
                            findStudent.set({profilePic:{data : req.file.filename,}});
                            findStudent.save();
                            return res.status(200).json({"Image Upload " : findStudent})
                            
                        }
                        
                    }
                })
            }
        
          
               
        } catch (error) {
            console.log(`Image Upload Error ${error}`);
            return res.status(403).json({"Image Upload Error" : error})
        }

    },

    sendOTP : async(req,res)=>{
        try {
            if(!req.headers["sharda-access-token"]){
                return res.status(404).json({msg : "Need Token"});
            }
            var fetchStudent = await getStudent(req.headers["sharda-access-token"]);
            var otp =  generateRandomNumber();

            var time = new Date();
            var currentTime = time.getTime();

             await sendMail(fetchStudent.email,"Account Verification",`${otp}`);

            var hasOTP = hashContent(otp.toString());
            fetchStudent.set({otp :hasOTP,otpExpireTime : currentTime + 10*60000 });
            await fetchStudent.save();
            return res.status(200).json({email : fetchStudent.email,otpStatus : "Send Successfully"})


        } catch (error) {
            return res.status(403).json({otpStatus : `Failed to send ${error}`})
            
        }
    },

    verifyOTP : async(req,res)=>{
            try{
                if(!req.headers["sharda-access-token"]){
                    return res.status(404).json({msg : "Need Token"});
                }
                var time = new Date();
                var fetchStudent = await getStudent(req.headers["sharda-access-token"]);

                if(parseInt(time.getTime()) <= parseInt(fetchStudent.otpExpireTime)){

                    bcrypt.compare(req.body.otp.toString(),fetchStudent.otp,async(err,result)=>{
                        if(result){
                            await fetchStudent.updateOne({$unset : {otp : fetchStudent.otp, otpExpireTime : fetchStudent.otpExpireTime}})
                            fetchStudent.save();
                            return res.status(200).json({otpStatus : "OTP Verified"})
                        }
                        else{
                            return res.status(401).json({otpStatus : "Wrong OTP"})  
                        }
                    });                    
                   

                }
                else{
                    await fetchStudent.updateOne({$unset : {otp : fetchStudent.otp, otpExpireTime : fetchStudent.otpExpireTime}})
                    fetchStudent.save();
                  return res.status(400).json({otpStatus : "OTP Expire"})  ;
                    
                }


            }
            catch (error) {
                return res.status(403).json({otpStatus : `Failed to send ${error}`})
                
            }
    },
    
}

export default studentRouter;

