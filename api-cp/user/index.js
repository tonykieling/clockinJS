const mongoose = require("mongoose");
const userControllers = require("../controllers/user.js");

module.exports = async (req, res) => {
  console.log("INSIDE user/index.js");
  const { method }  = req;
  console.log("=>req.body", req.body);
  const whatToDo = req.body ? req.body.whatToDo : undefined;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
      
      switch (method) {
        case "GET":
          console.log("----------inside user.js GET", req.query);
          // it receives a user id for new password request
          // the user is gonna be checked in the function below
          await userControllers.get_by_code(req, res);
          break;
          
      case "POST":
        console.log("   POST");
        if (whatToDo === "login") {
          console.log("      login going to user controllers");
          await userControllers.login(req, res);
        } else if (whatToDo === "signUp") {
          console.log("      login going to user controllers - signUp");
          await userControllers.signup(req, res);
        } else if (whatToDo === "request-change-password") {
          console.log("change passowrd REQUESTED!!");
          await userControllers.forget_password(req, res);
        } else if (whatToDo === "reset-password") {
          console.log("change password received");
          await userControllers.reset_password(req, res);
        } else if (whatToDo === "forget-password") {
          console.log("forget password is coming");
          await userControllers.forget_password(req, res);
        }

        else {
          console.log("inside user.js GET", req.body);
          res.status(200).json({message: "getResponse MesSAge"});
        }
  
        break;
  
      case "DELETE":
  
        break;
  
      case "PATCH":
        await userControllers.modify_user(req, res);
        break;
      
      default:
        console.log("user.js DEFAULT!!!!");
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    console.log("........disconnecting............");
    await mongoose.disconnect();
  } catch (err) {
    console.log("error on MongoDB connection");
    console.log(err.message);
  }

};


