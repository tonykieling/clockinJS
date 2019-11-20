const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
const User      = require("../models/user.js");
const Client    = require("../models/client.js");
const moment    = require("moment");

// it gets all users from the system - on purpose with no auth
const get_all = async (req, res) => {
// console.log("req.query.clientId", req.query.clientId)
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;

  const 
    clientId  = req.query.clientId,
    dateStart = new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
    dateEnd   = new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");
    

  try {
    let allClockins = null;
    // if (!userAdmin)
    if (userAdmin) /////////////// ----->>>>> this is the right one
      allClockins = await Clockin
        .find()
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");
    else
      allClockins = await Clockin
        .find({ 
          user_id: userId,
          date: {
            $gt: dateStart,
            $lt: dateEnd
          },
          client_id: clientId
        })
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");

    if (!allClockins || allClockins.length < 1)
      return res.status(200).json({
        message: `No clockins at all.`
      });
    
    if (clientId) {
      const client = await Client
        .findById( clientId )
        .select(" nickname ");

      return res.status(200).json({
        count: allClockins.length,
        allClockins,
        client: client.nickname });
      }

    res.status(200).json({
      count: allClockins.length,
      allClockins
    });
  
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EACK02: Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
const get_one = async (req, res) => {
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
const clockin_add = async (req, res) => {
console.log("req.body", req.body);
  const {
    rate,
    notes
     } = req.body;

  const 
    d   = new Date(req.body.date).getTime();
    t1  = (Number(req.body.timeStart.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.timeStart.split(':')[1]) * 60 * 1000);
    t2  = (Number(req.body.timeEnd.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.timeEnd.split(':')[1]) * 60 * 1000);
    client_id   = req.body.clientId;

  const userId = req.userData.userId;
  const time_start = new Date(d + t1);
  const time_end   = new Date(d + t2);
  const date = new Date(d);
  // const date = new Date().toLocaleString('en-UK', {timeZone: "America/Vancouver"});

  // check for the User
  let userExist = "";
  try {
    userExist = await User
      .findOne({ _id: userId });

    if (!userExist)
      return res.status(200).json({
        error: `ECKA01: User <${userId}> does not exist`
      });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `ECKA02: Something got wrong`
    });
  }

  // check for the Client
  // admin is able to insert a clockin for another user
  let clientExist = "";
  try {
    clientExist = await Client
      .findOne({ _id: client_id });
    if (!clientExist)
      return res.status(200).json({
        error: `ECKA03: Client <${client_id}> does not exist`
      });

    // check whether the Client belongs to the User
    // later on allow the admin create a clockin for another user
    if (clientExist.user_id != userId)
      return res.status(200).json({
        error: `ECKA04: Client <${clientExist.name}> does not belong to User <${userExist.name}>.`
      });    
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `ECKA05: Something got wrong`
    });
  }

  // lets record clockin after User and Client validation
  try {
    const newClockin = new Clockin({
      _id: new mongoose.Types.ObjectId(),
      date,
      time_start,
      time_end,
      rate,
      notes,
      client_id,
      user_id: userId,
      invoice_id: null
    });

    await newClockin.save();
    
    res.json({
      message: "Clockin has been created.",
      user: userExist.name,
      client: clientExist.name
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(200).json({
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
        .findById( clockinId )
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

const clockin_delete = async (req, res) => {
console.log("inside CLOCKIN DELETE");
  // const clockinId = req.params.clockinId;
  const clockinId = req.body.clockinId;
  const userId    = req.userData.userId;
  const userAdmin = req.userData.admin;

  try {
    const clockinToBeDeleted = await Clockin
      .findById(clockinId);
    if (!clockinToBeDeleted || clockinToBeDeleted.length < 1)
      return res.status(409).json({
        error: `ECKD01: Clockin <${clockinId} NOT found.`
      });

    if ((userId != clockinToBeDeleted.user_id) && (!userAdmin))
      return res.status(200).json({
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