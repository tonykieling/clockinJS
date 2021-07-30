const mongoose    = require("mongoose");
// const userControllers = require("../controllers/user.js");

const bcrypt      = require("bcrypt");
const nodemailer  = require("nodemailer");
const User        = require("../models/user.js");



const tokenCreation = async (email, userId, name, admin) => {

  const jwt = require("jsonwebtoken");

  // console.log("@@@@@@@@@@inside tokenCreation");
    try {
      const token = jwt.sign({
          email,
          userId,
          name,
          admin
        },
        process.env.JWT_KEY,
        {
          expiresIn: process.env.JWT_expiration,
        });

      return token;
    } catch(err) {
      // console.log("ErrorMESSAGE: ", err.message);   //no console, too big message
      return ({
        error: "ETC01: Token is invalid"
      });
    }
  };

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.password
  }
});
    
  
const sendResetPassword = async (subject, user, code) => {
  // the link below will be received by the react app, react route.
  const content = (`
    <div>
      <p>Hi <b>${user.name.split(" ")[0]}</b></p>
      <p>Recently you asked to reset your password.</p>
      <p>Click on <a href="https://clockinjs.herokuapp.com/reset_password/${code}">reset password</a> to proceed.</p>
      <br>
      <p>Please, disregard this message in case you do not intend to change your password.</p>
      <br>
      <p>Kind regards from</p>
      <h4>Clockin.js Team :)</h4>
    </div>
  `);

  await generalSender(user.email, subject, content);
}
  
  
/**
 * this method is called when a new user is signed up
 * it is used to advise and let me knwo so I can add the nes user as mailgun authorized recipient
 * the caller method need to pass only the new user object
 *  */
const gotNewUser = async (user) => {
  const content = (`
    <div>
      <p>New user</p>
      <p><b>${user}</b></p>
      <br>
      <p>Kind regards from</p>
      <h4><a href="https://clockinjs.herokuapp.com">Clockin.js</a> Team :)</h4>
    </div>
  `);

  await generalSender("tony.kieling@gmail.com", "!!!!! Clockin.js got a new user", content);
}
  
  
/**
 * it send a welcome message to the new user
 */
const welcomeEmail = async (user, to) => {
  const content = (`
    <div>
      <p>Hi ${user.split(" ")[0]}.</p>
      <p>Welcome to <a href="https://clockinjs.herokuapp.com">Clockin.js</a></p>
      <br>
      <p>Feel free to use the system, register your clients, punch your worked times and generated invoices.<p>
      <br>
      
      <p>Kind regards from</p>
      <h4><a href="https://clockinjs.herokuapp.com">Clockin.js</a> Team :)</h4>
    </div>
  `);

  await generalSender(to, "Welcome - Clockin.js", content);
};
  
  
  
const generalSender = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from  : "Clockin.js<clockin.js@gmail.com>",
      to,
      subject,
      html,
    });
  } catch(error) {
    // this error is related to the email part, 
    // it does not mean the system signed up the new user, that mean, the flow goes keeping
    console.trace(error.message || message);
  }
}
  
  
const confirmPasswordChange = async(user) => {
  // it sends an email to the user confirming the procedure
  const content = (`
    <div>
      <p>Hi <b>${user.name.split(" ")[0]}</b></p>
      <p>Your password has just changed.</p>
      <br>
      <br>
      <br>
      <p>Kind regards from</p>
      <h4>Clockin.js Team :)</h4>
    </div>
  `);

  await generalSender(user.email, "Clockin.js - Password changing process", content);
}

const showDate = incomingDate => {
  const date = new Date(incomingDate);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getUTCDate() > 9 ? date.getUTCDate() : `0${date.getUTCDate()}`;
  return(`${month[date.getUTCMonth()]} ${day}, ${date.getUTCFullYear()}`);
}


const showTime = incomingTime => {
  const time = new Date(incomingTime);
  return((time.getUTCHours() < 10 
          ? ("0" + time.getUTCHours()) 
          : time.getUTCHours()) 
      + ":" + 
      (time.getUTCMinutes() < 10 
          ? ("0" + time.getUTCMinutes()) 
          : time.getUTCMinutes()));
}



module.exports = async (req, res) => {
  // console.log("INSIDE user/index.js");
  const { method }  = req;
  // console.log("=>req.body", req.body);
  const whatToDo = req.body ? req.body.whatToDo : undefined;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
      
      switch (method) {
        // case "GET":
          // console.log("----------inside user.js GET", req.query);
          // // it receives a user id for new password request
          // // the user is gonna be checked in the function below
          // await userControllers.get_by_code(req, res);
          // break;
          
      case "POST":
        if (whatToDo === "login") {
          
          
          // console.log("*** inside LOGIN");
  const email     = req.body.email;
  const password  = req.body.password;
// console.log("req.body", req.body);

  try {
    const user = await User
      .findOne({ email });
// console.log("user::", user);
    if (!user || user.length < 1)
      res.status(401).json({ 
        error: "ELIN01: Authentication has failed"
      });
      
    else {
      try {
        const checking = await bcrypt.compare(password, user.password);

        if (checking) {
          const token = await tokenCreation(user.email, user._id, user.name, user.admin);
          
          res.json({
            message: "success", 
            user: {
              _id         : user._id,
              name        : user.name,
              email       : user.email,
              admin       : user.admin,
              address     : user.address,
              city        : user.city,
              postalCode  : user.postal_code,
              phone       : user.phone
            },
            token
          });        
        } else {
          res.status(401).json({ 
            error: "ELIN02: Check your user and password"
          });          
        }
      } catch(error){
          throw ({localMessage: (error.message || message)});
        }
      }

    } catch(error) {
      console.trace(error.message || error);
      res.status(401).json({ 
        error: (error.localMessage || "ELIN03: Authentication has failed" || error.message || error)
    });
  }

        } else if (whatToDo === "signUp") {
          // console.log("      going to user controllers - signUp");

          const {
            name,
            email,
            password,
            address,
            city,
            phone,
            postalCode
          } = req.body;


          // it checks whether user exists, if so, it sends the error and breaks the flow
          try {
            const userExist = await User
              .find({ email });
          
            if (userExist.length > 0) throw({text: `User <email: ${email}> already exists.`});

          } catch(error) {
            res.status(200).json({
              error: error.text || `ESUP01: Email <${email}> is invalid`
            });

            break;
          }
          
        
          try {
            const hash = await bcrypt.hash(password, 10);

            // console.log(" ####after hash:", hash);
            // await gotNewUser("hash");
            /////////////delete

            if (hash) {
              
              const user = await new User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                password: hash,
                address,
                city,
                postal_code: postalCode,
                phone
              });

              // console.log(" ####before saving, user:", user);
              // await gotNewUser("user");
              /////////////////// delete the line above
      
              await user.save();
              
      
              // await gotNewUser("saved");
              // console.log("333333after saving:", user);
              //////////delete
              

              // it's killing in here
              const token = await tokenCreation(user.email, user._id, user.name, user.admin);
              // const token = await tokenCreation(email, name);
              if (token.error) throw(token.error);
              user.postalCode = postalCode;

              
              // console.log("@@@@@@@@@token", token);
              // // res.send({error: "retestttttttttttt"});
              // console.log("token22222222222 is okay");
              
      
              // letting me know about the new user :)
              await gotNewUser(user);
      
              // send a welcome email to the new user
              await welcomeEmail(user.name, user.email);
      
              res.send({
                message: `User <${user.email}> has been created.`, 
                user, 
                token
              });
            } else throw("");
        
          } catch(error) {
            // console.log("the error is::::", error);
            res.status(200).json({
              error: error.message || error || "ESUP02: Something bad at the password process."
            });
          }
        }

        // } else if (whatToDo === "request-change-password") {
        //   console.log("change passowrd REQUESTED!!");
        //   await userControllers.forget_password(req, res);
        // } else if (whatToDo === "reset-password") {
        //   console.log("change password received");
        //   await userControllers.reset_password(req, res);
        // } else if (whatToDo === "forget-password") {
        //   console.log("forget password is coming");
        //   await userControllers.forget_password(req, res);
        // }

        // else {
        //   console.log("inside user.js GET", req.body);
        //   res.status(200).json({message: "getResponse MesSAge"});
        // }
  
        break;
  
      case "DELETE":
  
        break;
  
      // case "PATCH":
      //   await userControllers.modify_user(req, res);
      //   break;
      
      default:
        console.log("user.js DEFAULT!!!!");
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    // console.log("........disconnecting............");
    await mongoose.disconnect();
  } catch (err) {
    console.log("error on MongoDB connection");
    console.log(err.message);
  }

};


