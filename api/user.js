const mongoose = require("mongoose");
const userControllers = require("./controllers/user.js");

module.exports = async (req, res) => {
  console.log("INSIDE user.js");
  const { method }      = req;
  const { whatToDo }    = req.body;


  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
        .then(console.log("DB is OKAY!!"))
        .catch("errorrrrrrrrrrrrrr :/");

    switch (method) {
      case "GET":
        
        // res.status(200).json(getResponse);
        break;
  
      case "POST":
        console.log("   POST");
        if (whatToDo === "login") {
          console.log("      login going to user controllers");
          await userControllers.login(req, res);
        } else if (whatToDo === "signUp") {
          console.log("      login going to user controllers - signUp");
          await userControllers.signup(req, res);
        } else if (whatToDo === "change-password") {
          console.log("change password received");
          await userControllers.forget_password(req, res);
        }
  
        break;
  
      case "DELETE":
  
        break;
  
      case "PATCH":
  
        break;
      
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    console.log("testttttt after switch........disconnecting............");
    await mongoose.disconnect();
  } catch (err) {
    console.log("error on MongoDB connection");
    console.log(err.message);
  }

};


