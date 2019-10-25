const mongoose      = require("mongoose");
const bcrypt        = require("bcrypt");

const User          = require("../models/user.js");
const tokenCreation = require("../helpers/token.js").token_creation;


// it gets all users from the system - on purpose with no auth
get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
  if (!userAdmin)
    return res.status(403).json({
      error: `EUGA01: User <${userId}> is not Admin`
    });
  
  try {
    const allUsers = await User
      .find()
      .select(" name email admin ")

    if (!allUsers || allUsers.length < 1)
      return res.status(200).json({
        message: `No users at all.`
      });
    
    res.status(200).json({
      message: allUsers
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EUGA02: Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
get_one = async (req, res) => {
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
signup = async (req, res) => {
  const name      = req.body.name;
  const email     = req.body.email;
  const password  = req.body.password;
  const admin     = req.body.admin;

  // it checks whether the email is already been used by an user account
  // if so, it returns an error message
  try {
    const userExist = await User
      .find({ email });
  
    if (userExist.length > 0)
      return res.status(409).json({ error: `User <email: ${email}> alread exists.`});
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `ESUP01: Email <${email}> is invalid`
    });
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err)
      return res.status(400).json({
        error: "ESUP02: Something bad at the password process."
      });
    else {
      try{
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name,
          email,
          password: hash,
          admin
        });

        await user.save();

        const token = await tokenCreation(user.email, user._id, user.name, user.admin);

        res.json({
          message: `User ${user.email} has been created.`, 
          user, 
          token
        });

      } catch(err) {
        console.trace("Error: ", err.message);
        res.status(422).json({
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
login = async (req, res) => {
  const email     = req.body.email;
  const password  = req.body.password;

  try {
    const user = await User
      .findOne({ email });

    if (!user || user.length < 1)
      return res.status(401).json({ 
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
            user, 
            token
          });
        }
        else
          res.status(401).json({ 
            error: "ELIN03: Authentication has failed"
          });
      });
    }
  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(401).json({ 
      error: "ELIN04: Authentication has failed"
    });
  }
}


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
modify_user = async (req, res) => {
  if (!req.userData.admin)
    return res.status(401).json({
      error: `EMU01: User <${req.userData.email} is not an Admin.`
    });

  const user  = req.params.userId;
  const name  = req.body.name,
        email = req.body.email,
        admin = req.body.admin;

  try {
    const checkUser = await User
      .findById(user);
    
    if (!checkUser)
      return res.status(404).json({
        error: `EMU02: User <${user}> NOT found.`
      });

    if (!email) {
      return res.status(409).json({
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
          admin
        }
      }, {
        runValidators: true
      });
    
    if (changeUser.nModified) {
      const modifiedUser = await User
        .findById({ _id: user})
        .select(" name email admin");

      res.json({
        message: `User <${modifiedUser.email}> has been modified.`
      });
    } else
      res.status(409).json({
        error: `EMU04: User <${user}> not changed.`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(409).json({
      error: "EMU05: Something bad"
    });
  }
}


// FIRST it needs to check whether the user is admin
// it is checked in the token admin field
// it deletes an user account
delete_user = async (req, res) => {
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


module.exports = {
  get_all,
  get_one,
  signup,
  login,
  modify_user,
  delete_user
}