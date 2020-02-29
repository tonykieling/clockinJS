const mongoose      = require("mongoose");
const bcrypt        = require("bcrypt");

const User          = require("../models/user.js");
const tokenCreation = require("../helpers/token.js").token_creation;
const sendEmail     = require("../helpers/send-email.js");


/**
 * It gets all users from the system.
 * P.S.: It is an ADMIN ACTION!
 * @return {User} List of all Users.
 */
const get_all = async (req, res) => {
console.log("*** inside USER get_all");
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
  if (!userAdmin)
    return res.status(403).json({
      error: `EUGA01: User <${userId}> is not Admin`
    });
  
  try {
    const allUsers = await User
      .find()
      .select(" name email admin address city postal_code phone");

    if (!allUsers || allUsers.length < 1)
      return res.status(200).json({
        message: `No users at all.`
      });
    
    res.status(200).json({
      count: allUsers.length,
      message: allUsers
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EUGA02: Something got wrong."
    });
  }
}


/**
 * It gets one user - on purpose with no auth
 * @param {number} req.params.userData.userId it's asd,
 * @return {number} Data about one specific User.
 */
const get_one = async (req, res) => {
console.log("*** inside USER get_one");

  const userAdmin       = req.userData.admin;
  const userId          = req.userData.userId;
  const userToBeChecked = req.params.userId;

  if (!userAdmin || userToBeChecked !== userId)
    return res.status(403).json({
      error: `EUG01: User <${userId}> with no permission`
    });

  try {
    const user = await User
      .findById(userToBeChecked)
      .select(" name email admin ");

    if (!user || user.length < 1)
      return res.status(409).json({
        error: `EUGO02: User <id: ${userId}> does not exist.`
      });
    
    res.status(200).json({
      message: user
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EUGO03: Something got wrong."
    });
  }
}


// it creates an user account
const signup = async (req, res) => {
console.log("*** inside USER signup");
  const {
    name,
    email,
    password,
    address,
    city,
    phone,
    postalCode
  } = req.body;

// console.log("req.body = signup", req.body);
  // it checks whether the email is already been used by an user account
  // if so, it returns an error message
  try {
    const userExist = await User
      .find({ email });
  
    if (userExist.length > 0)
      return res.status(200).json({ 
        error: `User <email: ${email}> alread exists.` });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `ESUP01: Email <${email}> is invalid`
    });
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err)
      return res.status(200).json({
        error: "ESUP02: Something bad at the password process."
      });
    else {
      try{
        const user = new User({
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
        user.postalCode = postalCode;

        // send email for me so I can add the new user as an Authorized Recipient.
        sendEmail.gotNewUser(user);

        // send a welcome email to the new user
        sendEmail.welcomeEmail(user.name, user.email);

        return res.send({
          message: `User <${user.email}> has been created.`, 
          user, 
          token
        });

      } catch(err) {
        console.trace("Error: ", err.message);
        return res.status(200).json({
          error: "ESUP03: Something wrong with email."
        });
      };
    }
  });
}


// it logs the user
// TODO:
// 1- need to check what to send as within token and user - for instance, password
// 2- need to create a function to change only password
const login = async (req, res) => {
console.log("*** inside LOGIN");
  const email     = req.body.email;
  const password  = req.body.password;

  try {
    const user = await User
      .findOne({ email });

    if (!user || user.length < 1)
      return res.status(200).json({ 
        error: "ELIN01: Authentication has failed"
      });
    else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err)
          return res.status(401).json({ 
            error: "ELIN02: Authentication has failed"
          });
          
        if (result){
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
        }
        else
          res.status(200).json({ 
            error: "ELIN03: Authentication has failed"
          });
      });
    }
  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(200).json({ 
      error: "ELIN04: Authentication has failed"
    });
  }
}


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
const modify_user = async (req, res) => {
console.log("*** inside modify_user");

  const user  = req.params.userId;
  const { name,
          email,
          admin,
          address,
          city,
          postalCode,
          phone } = req.body;

  try {
    const checkUser = await User
      .findById(user);
    
    if (!checkUser)
      return res.status(200).json({
        error: `EMU02: User <${user}> NOT found.`
      });

    if (!email) {
      return res.status(200).json({
        error: `EMU03: Email <${email}> is invalid.`
      });
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
      const modifiedUser = await User
        .findById({ _id: user})
        .select(" name email admin");

      const token = await tokenCreation(modifiedUser.email, modifiedUser._id, modifiedUser.name, modifiedUser.admin);

      const returnUser = {
        name, email, city, address, postalCode, phone, token
      }
      
      return res.json({
        message : `User <${modifiedUser.email}> has been modified.`,
        newData    : returnUser
      });

    } else
      return res.status(200).json({
        message: `User <${email}> not changed- no new data`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(200).json({
      error: "EMU05: Something bad happened. Try again."
    });
  }
}



// FIRST it needs to check whether the user is admin
// it is checked in the token admin field
// it deletes an user account

// need to check whether there is clockin for that invoice to be deleted
// implement soft deletion

const delete_user = async (req, res) => {
  if (!req.userData.admin)
    return res.status(401).json({
      error: `EDU01: User <${req.userData.email} is not an Admin.`
    });

  const userId = req.params.userId;

  try {
    const userToBeDeleted = await User.findById(userId);
    if (!userToBeDeleted || userToBeDeleted.length < 1)
      throw Error;
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `EDU02: User <${userId} NOT found.`
    });
  }

  try {
    const userDeleted = await User.deleteOne({ _id: userId});

    if (userDeleted.deletedCount)
      return res.status(200).json({
        message: `User <${userId}> has been deleted`
      });
    else
      throw Error;
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(404).json({
      error: `EDU03: Something bad with User id <${userId}>`
    })
  }
}



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const forget_password = async (req, res) => {
console.log("*** inside FORGET PASSWORD");
  const user  = req.body.data.email;

  try {
    const userExist = await User
      .find( { email: user });

    if (userExist.length > 0) {
        /**
         * generate a code
         * in the user schema, create a code and expiry time to it
         * record the code into the db along the expiry
         * send the url which points to a page to reset password
         * url: https://clockinjs.herokuapp.com/resetpwd/<code>
         *    new password + confirm new password
         * 
         * server will receive a post where the code identifies the user
         * */

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
            return res.send({
              error: `EFP01: Error in recording code(1).`
            });

          } catch(err) {
            console.trace("Error EFP02: ", err.message);
            return res.status(200).json({
              error: "EFP02: Error in recording code(2)"
            });
          }

          //  send the email
          sendEmail.sendResetPassword("Clockin.js - Reset Password", userExist[0], code);
          return res.send({
            message: "Email has been sent"
          });
    }
    // } else  there is no else due to if there is no email, system does nothing.
    // actually, if there is no email, system is gonna send a message just to the front -end receive it
    return res.send({
      message: "email is not valid"
    });
  } catch(err) {  // system answer if there is an error
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `Error: EFP03`
    });
  }
}



/**
 * method to change password and return user to loggin autometically
 * @param {*} req 
 * @param {*} res 
 */
const reset_password = async (req, res) => {
console.log("*** inside RESET PASSWORD");
  const code  = req.params;
  const {
    userId, 
    newPassword
   } = req.body.data;

   try {
    const userExist = await User
      .findOne({ _id: userId });

      if (userExist.length < 1)
      return res.status(200).json({ 
        error: `Error: URP01` });
        
    else {
        /**check timestamp!!!!!!!!!!!!!!!!!! */
// http://localhost:3000/reset_password/485b7950-3cab-11ea-817d-57374e57b7c8

      if (userExist.code_expiry_at < new Date().getTime())
        return res.send({
          error : "Code has already expired. Please, generate a new one.",
          code  : "expired"
        });

        bcrypt.hash(newPassword, 10, async (err, hash) => {
          if (err)
            return res.json({
              error: "Error: URP02"
            });
          else {
            try {
              const resetPassword = await User
                .updateOne({
                  _id: userExist._id
                }, {
                  $set: {
                    password        : hash,
                    code            : "",
                    code_expiry_at  : ""
                  }
                });
                
              if (!resetPassword.nModified)
                return res.send({
                  error: "Error: URP03"
                });

                const token = await tokenCreation(userExist.email, userExist._id, userExist.name, userExist.admin);

                res.json({
                  message: "success", 
                  user: {
                    _id         : userExist._id,
                    name        : userExist.name,
                    email       : userExist.email,
                    admin       : userExist.admin,
                    address     : userExist.address,
                    city        : userExist.city,
                    postalCode  : userExist.postal_code,
                    phone       : userExist.phone
                  },
                  token
                });

            } catch(err) {
              console.trace("Error: URP04", err.message);
              return res.status(200).json({
                error: "Error: URP04"
              });
            }
          }
        });
      }

    } catch(err) {
      console.trace("Error: ", err.message);
      return res.status(200).json({
        error: `Error: URP05`
      });
    }
}



/**
 * this method provide info about user when they are about to reset password
 * @param {*} req 
 * @param {*} res 
 */
const get_by_code = async (req, res) => {
console.log("*** inside get_by_code")  ;
  const code  = req.params.code;

  try {
    const user = await User
      .findOne({ code });

    if (!user || user.length < 1) { 
      return res.json({
        error: `EGUBC01: This code is not valid anymore. Try a new reset password.`
      });
    }
    
    if (user.code_expiry_at < new Date().getTime())
      return res.send({
        error : "Code has already expired. Please, generate a new one.",
        code  : "expired",
        user
      });      
      
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
        }
      });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EUGBC02: Something got wrong."
    });
  }
}



module.exports = {
  get_all,
  get_one,
  signup,
  login,
  modify_user,
  delete_user,
  forget_password,
  reset_password,
  get_by_code
}