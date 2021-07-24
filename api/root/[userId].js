const mongoose = require("mongoose");
const modifyUser = require("./user/modify-user.js");

module.exports = async (req, res) => {
  console.log("INSIDE userIDDDD.js");
  console.log("   1- req.query", req.query);
  console.log("   2- req.query", JSON.stringify(req.query));

  const { method }      = req;
  // const { whatToDo }    = req.body;


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
        // console.log("   POST");
        // if (whatToDo === "login") {
        //   console.log("      login going to user controllers");
        //   await userControllers.login(req, res);
        // } else if (whatToDo === "signUp") {
        //   console.log("      login going to user controllers - signUp");
        //   await userControllers.signup(req, res);
        // }
  
        break;
  

      case "DELETE":
  
        break;
  

      case "PATCH":
        //this is working
        await modifyUser(req, res);
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

