import Faculty from "../Models/FacultyModels.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Events from "../Models/Event_Models.js";
import keys from "../public/Private/private_keys.js";
import sendMail from "../public/EmailServide.js";

const getFaculty = async (token) => {
  var decode = jwt.verify(token, keys.TOKEN_KEY);
  var findFaculty = await Faculty.findOne({ email: decode.email });

  return findFaculty;
};
const generateRandomNumber = () => {
  var randVal = 10000 + Math.random() * (99999 - 10000);
  return Math.round(randVal);
};

const hashContent = (content) => {
  var hash = bcrypt.hashSync(content, 10);
  return hash;
};
var facultyRouters = {
  addNew: async (req, res) => {
    try {
      var password = req.body.password;

      password = hashContent(password);

      var createFaculty = Faculty({
        name: req.body.name,
        email: req.body.email,
        password: password,
        systemID: req.body.systemID,
        phoneNo: req.body.phone,
        gender: req.body.gender,
        userType: "Facu;ty",
        accountVerified: false,
      });

      var findEmail = await Faculty.findOne({ email: req.body.email });
      var findSystemID = await Faculty.findOne({ systemID: req.body.systemID });

      if (findEmail || findSystemID) {
        return res
          .status(201)
          .json({ FacultyRegistrationError: `Account already exist` });
      }

      var token = jwt.sign({ email: req.body.email }, keys.TOKEN_KEY);
      var createFaculty = await Faculty.create(createFaculty);

      return res
        .status(200)
        .json({ Faculty: createFaculty, token: token, isRegister: true });
    } catch (error) {
      console.log(`Faculty Registration ${error}`);
      return res.status(400).json({ FacultyRegistrationError: error });
    }
  },
  authorization: async function (req, res) {
    try {
      Faculty.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (err) {
            throw err;
          }
          if (!user) {
            res.status(403).send({ success: false, msg: "user not found" });
          } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                var token = jwt.encode(user.email, config.secret);
                res.json({
                  success: true,
                  token: token,
                  accountVerified: user.accountVerified,
                });
                return;
              } else {
                return res
                  .status(403)
                  .json({ success: false, msg: "Password wrong" });
              }
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },
  sendOTP: async (req, res) => {
    try {
      if (!req.headers["sharda-access-token"]) {
        return res.status(404).json({ msg: "Need Token" });
      }
      var fetchFaculty = await getFaculty(req.headers["sharda-access-token"]);
      var otp = generateRandomNumber();

      var time = new Date();
      var currentTime = time.getTime();

      await sendMail(
        fetchFaculty.email,
        "Account Verification",
        `${otp}`,
        fetchFaculty.name
      );

      var hasOTP = hashContent(otp.toString());
      fetchFaculty.set({
        otp: hasOTP,
        otpExpireTime: currentTime + 10 * 60000,
      });
      await fetchFaculty.save();
      return res
        .status(200)
        .json({ email: fetchFaculty.email, otpStatus: "Send Successfully" });
    } catch (error) {
      return res.status(403).json({ otpStatus: `Failed to send ${error}` });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      if (!req.headers["sharda-access-token"]) {
        return res.status(404).json({ msg: "Need Token" });
      }
      var time = new Date();
      var fetchFaculty = await getFaculty(req.headers["sharda-access-token"]);

      if (parseInt(time.getTime()) <= parseInt(fetchFaculty.otpExpireTime)) {
        bcrypt.compare(
          req.body.otp.toString(),
          fetchFaculty.otp,
          async (err, result) => {
            if (result) {
              await fetchFaculty.updateOne({
                $unset: {
                  otp: fetchFaculty.otp,
                  otpExpireTime: fetchFaculty.otpExpireTime,
                },
              });
              await fetchFaculty.updateOne({
                $set: {
                  accountVerified: true,
                },
              });
              fetchFaculty.save();
              return res.status(200).json({ otpStatus: "OTP Verified" });
            } else {
              return res.status(401).json({ otpStatus: "Wrong OTP" });
            }
          }
        );
      } else {
        await fetchFaculty.updateOne({
          $unset: {
            otp: fetchFaculty.otp,
            otpExpireTime: fetchFaculty.otpExpireTime,
          },
        });
        fetchFaculty.save();
        return res.status(400).json({ otpStatus: "OTP Expire" });
      }
    } catch (error) {
      return res.status(403).json({ otpStatus: `Failed to send ${error}` });
    }
  },

  forgetPassword: async function (req, res) {
    try {
      Faculty.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (err) {
            throw err;
          }
          if (!user) {
            return res
              .status(403)
              .send({ success: false, msg: "user not found" });
          } else {
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            Faculty.findOneAndUpdate(
              { email: req.body.email },
              { password: passwordHash },
              (err, data) => {
                if (err) {
                  throw err;
                }
                return res.status(200).send({
                  msg: "Password Reset",
                  user: { email: req.body.email, password: passwordHash },
                });
              }
            );
          }
        }
      );
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },
  getUserInfo: async function (req, res) {
    try {
      if (req.headers["x-access-token"]) {
        var token = req.headers["x-access-token"];
        var decodeToken = jwt.decode(token, config.secret);
        var getUserData = await Faculty.findOne({ email: decodeToken })
          .populate({ path: "assignedEvents" })
          .populate({ path: "eventsCreated" });
        return res.json({ success: "User Info", user: getUserData });
      } else {
        return res.json({ success: false, msg: "No Found" });
      }
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },

  getAllUser: async function (req, res) {
    try {
      var getAllUserData = await Faculty.find({}).populate({
        path: "eventsCreated",
      });
      return res.json({ user: getAllUserData });
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },

  singleUser: async function (req, res) {
    try {
      if (!req.headers["x-access-token"]) {
        return res.status(400).json({ msg: "Please provide token" });
      }
      var token = req.headers["x-access-token"];
      var decodeToken = jwt.decode(token, config.secret);
      var getUserData = await Faculty.findOne({ email: decodeToken }).populate({
        path: "eventsCreated",
      });
      return res.json({ user: getUserData });
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },

  uploadImage: async function (req, res) {
    try {
      var userImage;

      if (!req.headers["x-access-token"]) {
        return res.status(400).json({ msg: "Please provide token" });
      }

      if (!req.body.profileImage) {
        return res.status(400).json({ msg: "Please upload a profile image" });
      } else {
        userImage = req.body.profileImage;
      }

      var token = req.headers["x-access-token"];
      var decodeToken = jwt.decode(token, config.secret);
      var getUserData = await Faculty.findOneAndUpdate(
        { email: decodeToken },
        { profileImage: userImage }
      );
      await getUserData.save();
      return res.status(200).json({ msg: "Image Uploaded" });
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },

  assignFaculty: async function (req, res) {
    try {
      if (!req.body.eventID) {
        return res.status(400).json({ msg: "Event not found" });
      }
      if (!req.body.facultyID) {
        return res.status(400).json({ msg: "Faculty not provided" });
      }
      let eventID = req.body.eventID;
      let getEvent = await Events.findOne({ _id: eventID });
      if (getEvent.status === "open") {
        let facultyList = req.body.facultyID;
        for (let i = 0; i < facultyList.length; i++) {
          await getEvent.facultyAssigned.push(facultyList[i]);
          var getFaculty = await Faculty.findOne({ _id: facultyList[i] });
          await getFaculty.assignedEvents.push(eventID);
          getFaculty.save();
        }
        await getEvent.save();
        return res.status(200).json(getEvent);
      } else {
        return res.status(400);
      }
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },
  getAllEvents: async function (req, res) {
    try {
      let eventList = [];
      if (req.headers["x-access-token"]) {
        var token = req.headers["x-access-token"];
        var decodeToken = jwt.decode(token, config.secret);
        var getUserData = await Faculty.findOne({
          email: decodeToken,
        }).populate({ path: "assignedEvents" });
        for (var i = 0; i < getUserData.assignedEvents.length; i++) {
          if (getUserData.assignedEvents[i].status === "open") {
            eventList.push(getUserData.assignedEvents[i]);
            eventList.sort(function (a, b) {
              var c = new Date(a.startDate);
              var d = new Date(b.startDate);

              return c - d;
            });
          }
        }

        return res.json({ success: "events", eventsAssigned: eventList });
      } else {
        return res.json({ success: false, msg: "No Found" });
      }
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },
};

export default facultyRouters;
