const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
const User      = require("../models/user.js");
const Client    = require("../models/client.js");

// it gets all users from the system - on purpose with no auth
get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;

  try {
    let allClockins = null;
    if (userAdmin)
      allClockins = await Clockin
        .find()
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");
    else
      allClockins = await Clockin
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
      message: clockin
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
// Need:
// 1- Check userId and clientId
// 2- find clockin where
//   user_id && client_id
//   date >= date_start && date <= date_end
//   !invoice_id
// it will gice an array of clockins
// foreach:
//   1- Sum up total time (time_end-time_start) * rate
//   2- flag invoice_id to it
// and
//   write down invoice (it needs to be before 2)
clockin_add = async (req, res) => {
  const {
    date,
    time_start,
    time_end,
    rate,
    notes,
    client_id
     } = req.body;
  const userId = req.userData.userId
  
  // check for the User
  try {
    const userExist = await User
      .findOne({ _id: userId });
    if (!userExist)
      return res.status(403).json({
        error: `ECKA01: User <${userId}> does not exist`
      });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `ECKA02: Something got wrong`
    });
  }

  // check for the Client
  try {
    const clientExist = await Client
      .findOne({ _id: client_id });
    if (!clientExist)
      return res.status(403).json({
        error: `ECKA03: Client <${client_id}> does not exist`
      });

    // check whether the Client belongs to the User
    if (clientExist.user_id != userId)
      return res.status(403).json({
        error: `ECKA04: Client <${client_id}> does not belong to User <${userId}>.`
      });    
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `ECKA05: Something got wrong`
    });
  }

  // lets record clockin after User and Cleint validation
  try {
    const newClockin = new Clockin({
      _id: new mongoose.Types.ObjectId(),
      date,
      time_start,
      time_end,
      rate,
      notes,
      client_id,
      user_id: userId
    });

    await newClockin.save();

    res.json({
      message: `Clockin ${newClockin._id} has been created.`
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(422).json({
      error: "ECKA06: Something wrong with clockin's data."
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



// FIRST it needs to check whether the user is admin or the clockin belongs to the user which is proceeding

// need to check whether there is clockin for that invoice to be deleted
// implement soft deletion

clockin_delete = async (req, res) => {
  const clockinId = req.params.clockinId;
  const userId    = req.userData.userId;
  const userAdmin = req.userData.admin;

  try {
    const clockinToBeDeleted = await Clockin
      .findById(clockinId);
    if (!clockinToBeDeleted || clockinToBeDeleted.length < 1)
      return res.status(409).json({
        error: `ECKD01: Clockin <${clockinId} NOT found.`
      });

    if ((userId != clockinToBeDeleted.user_id) || (!userAdmin))
      return res.status(409).json({
        error: `ECKD02: Clockin <${clockinId}> does not belong to User <${userId}>.`
      });
  } catch(err) {
    return res.status(409).json({
      error: `ECKD03: Something went wrong.`
    });
  }

  try {
    const clockinDeleted = await Clockin.deleteOne({ _id: clockinId});

    if (clockinDeleted.deletedCount)
      return res.status(200).json({
        message: `Clockin <${clockinId}> has been deleted`
      });
    else
      throw Error;
  } catch (err) {
    res.status(404).json({
      error: `ECKD04: Something bad with Clockin id <${clockinId}>`
    })
  }
}


module.exports = {
  get_all,
  get_one,
  clockin_add,
  clockin_delete
}