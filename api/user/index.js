"use strict";
const mongoose    = require("mongoose");

const bcrypt      = require("bcrypt");
const nodemailer  = require("nodemailer");

const User = mongoose.model("User", mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },

    admin: {
      type: Boolean,
      default: false
    },

    name: {
      type: String
    },
    
    email: { 
      type: String, 
      required: true,
      createIndexes: true,
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
    password: { 
      type: String, 
      required: true
    },
    
    deleted: {
      type: Boolean
    },

    address: {
      type: String,
      // required: true
    },

    city: {
      type: String,
      // required: true
    },

    postal_code: {
      type: String,
      // required: true
    },

    phone: {
      type: String,
      // required: true
    },

    code: {
      type: String
    },

    code_expiry_at: {
      type: Number
    }
  })
);

const tokenCreation = async (email, userId, name, admin) => {
  const jwt = require("jsonwebtoken");

    try {
      const token = jwt.sign({
          email,
          userId,
          name,
          admin
        },
        `${process.env.JWT_KEY}`,
        {
          expiresIn: `${process.env.JWT_expiration}`,
        });

      return token;
    } catch(err) {
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
      <p><b>${JSON.stringify(user)} - </b></p>
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
      <p>Your password has just been changed.</p>
      <br>
      <br>
      <br>
      <p>Kind regards from</p>
      <h4>Clockin.js Team :)</h4>
    </div>
  `);

  await generalSender(user.email, "Clockin.js - Password changing success", content);
}



module.exports = async (req, res) => {
  "use strict";
  const { method }  = req;
  const whatToDo = req.body ? req.body.whatToDo : undefined;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
      
      switch (method) {
        case "GET":
          {
          // it is working good

            try {
              const { code } = req.query;

              if (!code)
                throw({localError: "Error: No user has been found."});
          
              const user = await User
                .find({ code });

              if (user.length < 1)
                throw({localError: "Error: EGUBC01 - This code is not valid anymore. Try a new reset password in the Login."});
              
              if (user.code_expiry_at < new Date().getTime()) {
                res.send({
                  error : "Code has already expired. Please, generate a new one.",
                  code  : "expired",
                  user
                });      
              } else {
                res.json({
                  message: "success", 
                  user: {
                    _id         : user[0]._id,
                    name        : user[0].name,
                    email       : user[0].email,
                    admin       : user[0].admin,
                    address     : user[0].address,
                    city        : user[0].city,
                    postalCode  : user[0].postal_code,
                    phone       : user[0].phone
                  }
                });
              }

            } catch(error) {
              res.status(200).json({
                error: (error.localError || "Error: EUGBC02 - Something got wrong.")
              });
            }

            break;
          }
      case "POST":
        if (whatToDo === "login") {

          // login is good
          const email     = req.body.email;
          const password  = req.body.password;

          try {
            const user = await User
              .findOne({ email });

            if (!user || user.length < 1)
              res.status(200).json({ 
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
                  res.status(200).json({ 
                    error: "ELIN02: Check your user and password"
                  });          
                }

              } catch(error) {
                  throw ({localMessage: `ELIN04: ${(error.message || error)}`});
                }
            }

          } catch(error) {
            res.status(200).json({ 
              error: (error.localMessage || "ELIN03: Authentication has failed" || error.message || error)
            });
          }

        } else if (whatToDo === "signUp") {
          // signup is working good

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

      
              await user.save();
              
              const token = await tokenCreation(user.email, user._id, user.name, user.admin);
              if (token.error) throw(token.error);
              user.postalCode = postalCode;

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
            res.status(200).json({
              error: error.message || error || "ESUP02: Something bad with password."
            });
          }
        
        } else if ((whatToDo === "request-change-password")  || (whatToDo === "forget-password")) {
          //it is working

          const email  = req.body.email;
          try {
            const userExist = await User
              .find( { email });

            if (userExist.length > 0) {
              
              // create a code, record it and the expiry timestamp for it
              const code = require('uuid/v1')();

              // record the code into the user db
              try {

                const code_expiry_at  = new Date().getTime() + 86400000;

                const recordCode = await User
                  .updateOne({
                    _id: userExist[0]._id
                  }, {
                    $set: {
                      code,
                      code_expiry_at
                    }
                  });
      
                if (!recordCode.nModified)
                  throw({localError: "EFP01: Error in recording code."});
      
                } catch(error) {
                  throw(error || "EFP02: Error in recording code");
                }
                
                //  send the email
                await sendResetPassword("Clockin.js - Reset Password", userExist[0], code);

                res.send({
                  message: "An email has been sent to your recorded email."
                });
            } else
              res.send({
                error: "EFP04: email is not valid"
              });

          } catch(error) {  // system answer if there is an error
            res.status(200).json({
              error: (error.localError || "Error: EFP03 - Please, try again later.")
            });
          }
        

        } else if (whatToDo === "reset-password") {

          // it is working good

          const {
            userId, 
            newPassword
          } = req.body;

          let userExist;
        
          try {
            userExist = await User
              .find({ _id: userId });
              // .find({ _id: "610478d25c743e0009825dfb" });

              // need to check this question about the userExist being empty
              // also print processing in the FE while the request is being processed.

            if (userExist.length < 1)
              throw({localError: "Error: URP01: Please, try again later."});

        
            /**check timestamp!!!!!!!!!!!!!!!!!! */
            // http://localhost:3000/reset_password/485b7950-3cab-11ea-817d-57374e57b7c8
             
            if (userExist.code_expiry_at < new Date().getTime())
              throw({code: "code"});

          } catch(error) {
            if (error.code) {
              res.send({
                error : "Code has already expired. Please, generate a new one.",
                code  : "expired"
              });
            } else {
              res.status(200).json({
                error: (error.localError || "Error: URP01B: Try again later.")
              });
            }

            break;
          }
              
           
          try {
            const hash = await bcrypt.hash(newPassword, 10);

            if (hash) {       
              const resetPassword = await User
                .updateOne({
                  _id: userExist[0]._id
                }, {
                  $set: {
                    password        : hash,
                    code            : "",
                    code_expiry_at  : ""
                  }
                });

              if (!resetPassword.nModified) 
                throw({localError: "Error URP02: Try again later."});
      
              const token = await tokenCreation(userExist.email, userExist._id, userExist.name, userExist.admin);
      
      
              // send an email to the user confirming the procedure
              await confirmPasswordChange(userExist);
        
        
              res.json({
                message: "success", 
                user: {
                  _id         : userExist[0]._id,
                  name        : userExist[0].name,
                  email       : userExist[0].email,
                  admin       : userExist[0].admin,
                  address     : userExist[0].address,
                  city        : userExist[0].city,
                  postalCode  : userExist[0].postal_code,
                  phone       : userExist[0].phone
                },
                token
              });

            } else throw({localError: "Error URP03: Hash issues"});

          } catch(error) {
            return res.status(200).json({
              error: (error.localError || "Error URP04: general error")
            });
          }
        
        } 
  
        break;  
      
      case "PATCH":
        // not doing this function based on params, instead data is coming by req.body
        // it is working

        const { 
                userId,
                name,
                email,
                admin,
                address,
                city,
                postalCode,
                phone } = req.body;
      
        try {
          const checkUser = await User
            .findById(userId);
          
          if (!checkUser) {
            throw({localMessage: `EMU02: User <${userId}> has NOT been found.`});
          }
      
          if (!email) {
            throw({localMessage: `EMU03: Email <${email}> is invalid.`});
          }
          
          const changeUser = await User
            .updateOne({
              _id: checkUser._id
            }, {
              $set: {
                email,
                name,
                admin,
                address,
                city,
                postal_code: postalCode,
                phone
              }
            }, {
              runValidators: true
            });
          
          if (changeUser.nModified) {
      
            const token = await tokenCreation(email, checkUser._id, name, admin);
      
            const returnUser = {
              name, email, city, address, postalCode, phone, token
            }
            
            res.json({
              message : `User <${email}> has been modified.`,
              newData    : returnUser
            });

          } else {
            throw({localMessage: `User <${email}> not changed- no new data`});
          }
      
        } catch(error) {
          res.status(200).json({
            error: (error.localMessage || "EMU05: Something bad happened. Try again.")
          });
        }
        
        break;
      
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    // console.log("........disconnecting............");
    await mongoose.disconnect();
  } catch (err) {
    // console.log(err.message);
    res.json({
      error: (error.localError || error.message || error)
    });
  } finally {
    // console.log("........disconnecting............");
    await mongoose.disconnect();
  }
};




