import bcrypt from "bcrypt";
import Faculty from "../Models/FacultyModels.js";
import Student from "../Models/Student_Model.js";

export const generateRandomNumber = () => {
  var randVal = 10000 + Math.random() * (99999 - 10000);
  return Math.round(randVal);
};
export const getFaculty = async (token) => {
  var decode = jwt.verify(token, keys.TOKEN_KEY);
  var findFaculty = await Faculty.findOne({ email: decode.email });

  return findFaculty;
};
export const getStudent = async (token) => {
  var decode = jwt.verify(token, keys.TOKEN_KEY);
  var findStudent = await Student.findOne({ email: decode.email });

  return findStudent;
};

export const hashContent = (content) => {
  var hash = bcrypt.hashSync(content, 10);
  return hash;
};

var commanCon = {
  forgetPassword: async function (req, res) {
    try {
      let user =
        (await Faculty.findOne({
          email: req.body.email,
        })) ??
        (await Student.findOne({
          email: req.body.email,
        }));

      if (!user) {
        return res.status(404).send({ success: false, msg: "User not found" });
      } else {
        if (user.userType === "Faculty") {
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
        } else {
          const passwordHash = bcrypt.hashSync(req.body.password, 10);
          Student.findOneAndUpdate(
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
    } catch (e) {
      console.log(e);
      return res.status(403).json({ msg: "Something went wrong" });
    }
  },
};
export default commanCon;
