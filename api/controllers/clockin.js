const mongoose  = require("mongoose");
const Clockin   = require("../models/clockin.js");


// it gets all users from the system - on purpose with no auth
get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
  
  try {
    let allClockins = null;
    if (userAdmin)
      allClients = await Clockin
        .find()
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");
    else
      client = await Clockin
        .find({ user_id: userId})      // it has to be for only that user
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");

    if (!allClockins || allClockins.length < 1)
      return res.status(200).json({
        message: `No clockins at all.`
      });
    
    res.status(200).json({
      message: allClockins
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EACK02: Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
get_one = async (req, res) => {
  const clockinId  = req.params.clockinId;
  const userAdmin  = req.userData.admin;
  const userId     = req.userData.userId;  
  
  try {
    const clockin = await Clockin
      .findById(clockinId)
      .select(" date time_start time_end rate notes invoice_id client_id user_id ");

    if (!clockin || clockin.length < 1)
      return res.status(409).json({
        error: `ECKGO01: Clockin <id: ${clockinId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(409).json({
        error: `ECKGO02: Clockin <id: ${clockinId}> belongs to another user.`
      });

    res.status(200).json({
      message: client
    });
  } catch(err) {
    console.log("Error => ", err.message);
    if (clockinId.length !== 24)
      return res.status(422).json({
        error: "ECKGO02: clockinId mystyped."
      });  
    res.status(422).json({
      error: "ECKGO03: Something got wrong."
    });
  }
}


// it creates a client register
clockin_add = async (req, res) => {
console.log("--> req.body", req.body);
  const {
    date,
    time_start,
    time_end,
    rate,
    notes,
    client_id
     } = req.body;
  const userId = req.userData.userId
return res.json({ date, time_start, time_end, rate, notes, client_id, userId});
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
client_modify = async (req, res) => {
  const clockinId  = req.params.clockinId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;  
  
  // this try is for check is the clockinId passed from the frontend is alright (exists in database), plus
  //  check whether either the client to be changed belongs for the user or the user is admin - if not, not allowed to change client's data
  try {
    const client = await Client
      .findById(clockinId);

    if (!client || client.length < 1)
      return res.status(409).json({
        error: `Client <id: ${clockinId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(409).json({
        error: `Client <id: ${clockinId}> belongs to another user.`
      });

  } catch(err) {
    console.log("Error => ", err.message);
    if (clockinId.length !== 24)
      return res.status(422).json({
        error: "ClientId mystyped."
      });  
    res.status(422).json({
      error: "ECM01: Something got wrong."
    });
  }


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

  try {
    const clientToBeChanged = await Client
      .updateOne({
        _id: clockinId
      }, {
        $set: {
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
        }
      }, {
        runValidators: true
      });
    
    if (clientToBeChanged.nModified) {
      const clientModified = await Client
        .findById({ _id: clockinId})
        .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");
        // .select(" name nickname mother consultant default_rate");

      return res.json({
        message: `Client <${clientModified}> has been modified.`
      });
    } else
      res.status(409).json({
        error: `Client <${clockinId}> not changed.`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(409).json({
      error: "ECM02: Something bad"
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

  const clockinId = req.params.clockinId;

  try {
    const clientToBeDeleted = await Client.findById(clockinId);
    if (!clientToBeDeleted || clientToBeDeleted.length < 1)
      throw Error;
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `ECD01: Client <${clockinId} NOT found.`
    });
  }

  try {
    const clientDeleted = await Client.deleteOne({ _id: clockinId});

    if (clientDeleted.deletedCount)
      return res.status(200).json({
        message: `User <${clockinId}> has been deleted`
      });
    else
      throw Error;
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(404).json({
      error: `ECD02: Something bad with Client id <${clockinId}>`
    })
  }
}


module.exports = {
  get_all,
  get_one,
  clockin_add,
  client_modify,
  client_delete
}