const mongoose  = require("mongoose");
const bcrypt    = require("bcrypt");
const jwt       = require("jsonwebtoken");
const Client    = require("../models/client.js");


// it gets all users from the system - on purpose with no auth
get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userID;
  
  try {
    let allClients = null;
    if (userAdmin)
      allClients = await Client
        .find()
        .select(" name nickname mother consultant user_id ");
    else
      client = await Client
        .find({ user_id: userId})      // it has to be for only that user
        .select(" name nickname mother consultant ")


    if (!allClients || allClients.length < 1)
      return res.status(409).json({
        error: `No clients at all.`
      });
    
    res.status(200).json({
      message: allClients
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
get_one = async (req, res) => {
  const clientId  = req.params.clientId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;  
  
  try {
    const client = await Client
      .findById(clientId)
      .select(" name nickname mother consultant user_id ");

    if (!client || client.length < 1)
      return res.status(409).json({
        error: `User <id: ${clientId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(409).json({
        error: `User <id: ${clientId}> belongs to another user.`
      });

    res.status(200).json({
      message: client
    });
  } catch(err) {
    console.log("Error => ", err.message);
    if (clientId.length !== 24)
      return res.status(422).json({
        error: "ClientId mystyped."
      });  
    res.status(422).json({
      error: "Something got wrong."
    });
  }
}


// it creates a client register
client_add = async (req, res) => {
  const {
        name,
        nickname, 
        birthday, 
        mother, 
        mphone, 
        memail, 
        father, 
        fphone, 
        femail, 
        consultant, 
        cphone, 
        cemail, 
        defaultRate
     } = req.body;
  const userId = req.userData.userId

  // it checks whether the email is already been used by an user account
  // if so, it returns an error message
  try {
    const clientExist = await Client
      .find({ name, nickname });
  
    if (clientExist.length > 0)
      return res.status(409).json({ error: `User <name: ${name} nickname: ${nickname}> alread exists.`});
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `Error CLIENTADD01`
    });
  }

  try {
    const client = new Client({
      _id: new mongoose.Types.ObjectId(),
      name,
      nickname, 
      birthday, 
      mother, 
      mphone, 
      memail, 
      father, 
      fphone, 
      femail, 
      consultant, 
      cphone, 
      cemail, 
      default_rate: defaultRate,
      user_id: userId
    });

    await client.save();

    res.json({
      message: `Client ${client.name} has been created.`
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(422).json({
      error: "Something wrong with client's data."
    });
  };
}


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
modify_user = async (req, res) => {
  const userID = req.userData.userID;
  const clientId = "asd";
  const userFromClient = Client.
    findById
  if (!req.userData.admin)
    return res.status(401).json({
      error: `User <${req.userData.email} is not an Admin.`
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
        error: `User <${user}> NOT found.`
      });

    if (!email) {
      return res.status(409).json({
        error: `Email <${email}> is invalid.`
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
        error: `User <${user}> not changed.`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(409).json({
      error: "Something bad"
    });
  }
}


// FIRST it needs to check whether the user is admin
// it deletes an user account
client_delete = async (req, res) => {
  if (!req.userData.admin)
    return res.status(401).json({
      error: `User <${req.userData.email} is not an Admin.`
    });

  const clientId = req.params.clientId;

  try {
    const clientToBeDeleted = await Client.findById(clientId);
    if (!clientToBeDeleted || clientToBeDeleted.length < 1)
      throw Error;
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `Client <${clientId} NOT found.`
    });
  }

  try {
    const clientDeleted = await Client.deleteOne({ _id: clientId});

    if (clientDeleted.deletedCount)
      return res.status(200).json({
        message: `User <${clientId}> has been deleted`
      });
    else
      throw Error;
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(404).json({
      error: `Something bad with Client id <${clientId}>`
    })
  }
}


module.exports = {
  get_all,
  get_one,
  client_add,
  modify_user,
  client_delete
}