const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
// const User      = require("../models/user.js");
const Client    = require("../models/client.js");
// const Invoice   = require("../models/invoice.js");
const Email = require("../helpers/send-email.js");


// it gets all clockins from the system - on purpose with no auth
const get_all = async (req, res) => {
console.log("inside clockins get_all");
  const checkInvoiceCode = require("./aux/checkInvoiceCode.js");
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
    else {
      // https://stackoverflow.com/questions/6502541/mongodb-query-multiple-collections-at-once
      // this code works - BEFORE doing a $lookup
      // allClockins = await Clockin
        // .find({ 
        //   user_id: userId,
        //   date: {
        //     $gte: dateStart,
        //     $lte: dateEnd
        //   },
        //   client_id: clientId
        // })
        // .select(" date time_start time_end rate notes invoice_id client_id user_id ");
      allClockins = await Clockin
        .aggregate([
          { $match: 
            {
              user_id: mongoose.Types.ObjectId(userId),
              date: {
                // $gte: "2019-05-06T00:00:00.000Z",
                // $lte: "2020-01-18T00:00:00.000Z"
                $gte: dateStart,
                $lte: dateEnd
              },
              client_id: mongoose.Types.ObjectId(clientId)
            }
          },
          { $lookup: 
            {
              from: "invoices",
              localField: "invoice_id",
              foreignField: "_id",
              as: "invoice"
            }
          },
          {
            $unwind: {
              path :'$invoice', 
              preserveNullAndEmptyArrays: true
            }
          },
          {
              $project: {
                  "invoice.__v": 0,
                  // "invoice._id": 0,
                  "invoice.date": 0,
                  "invoice.date_start": 0,
                  "invoice.date_end": 0,
                  "invoice.notes": 0,
                  "invoice.status": 0,
                  "invoice.total_cad": 0,
                  "invoice.client_id": 0,
                  "invoice.user_id": 0
              }
          }
        ])
        .sort({date: 1});
    }

    if (!allClockins || allClockins.length < 1) {
      return res.status(200).json({
        message: `No clockins at all.`
      });
    }


    /**
     * it checks whether the application is querying for last invoice code (queryLastInvoiceCode) used
     * if so, it calls checkInvoiceCode, which returns either:
     *  - null
     *  - the last code used (when the code is not ended with a valid number)
     *  - a new code, adding one to its ending part - here, it is an object with a attribute newCode
     *  */
    // const codeSuggestion = allClockins.length && await checkInvoiceCode(allClockins);
    const codeSuggestion = req.query.queryLastInvoiceCode ? await checkInvoiceCode(userId, clientId) : null;

    if (clientId) {
      const client = await Client
        .findById( clientId )
        .select(" nickname ");
        

// console.clear();
// console.log("--------------------------------------------------------");
// let totalCadTmp = 0;
// allClockins.forEach(async (clockin, i) => {
// // console.log(allClockins[i]);
//   const t = clockin.worked_hours 
//               ? ((clockin.worked_hours / 3600000) * clockin.rate)
//               : ((clockin.time_end - clockin.time_start) / 3600000) * clockin.rate;
//   totalCadTmp += t;
// console.log(i + 1 , t, "--> totalCadTmp", totalCadTmp, " - ", clockin.date);
// if (i === 4 || i === 5) console.log(clockin);
// });

      return res.status(200).json({
        count: allClockins.length,
        allClockins,
        client: client.nickname, 
        codeSuggestion
      });
    };

    return res.status(200).json({
      count: allClockins.length,
      allClockins
    });
  
  } catch(err) {
    console.log("Error => ", err.message);
    return res.status(422).json({
      error: "EACK02: Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
const get_one = async (req, res) => {
console.log("inside clockins get_one");
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
// it will give an array of clockins
// foreach:
//   1- Sum up total time (time_end-time_start) * rate
//   2- flag invoice_id to it
// and
//   write down invoice (it needs to be before 2)
const clockin_add = async (req, res) => {
console.log("inside clockins ADD");

  const userId      = req.userData.userId;
  const checkUser   = require("../helpers/user-h.js");
  // it checks whether user is OK and grab info about them which will be used later
  const temp_user   = await checkUser.check(userId);
  if (!temp_user.result)
    return res.send({
      error: temp_user.message
    });
  const userExist   = temp_user.checkUser;


  // it checks whether client is OK and grab info about them which will be used later
  const client_id     = req.body.clientId;
  const checkClient   = require("../helpers/client-h.js");
  const temp_client   = await checkClient.check(client_id, userId);
  if (!temp_client.result)
    return res.send({
      error: temp_client.message || temp_client.text
    });
  const clientExist   = temp_client.checkClient;


  // lets record clockin after User and Client validation
  const {
    rate,
    notes
     } = req.body;

  const 
    d   = new Date(req.body.date).getTime(),
    t1  = (Number(req.body.timeStart.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.timeStart.split(':')[1]) * 60 * 1000),
    t2  = (Number(req.body.timeEnd.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.timeEnd.split(':')[1]) * 60 * 1000);
  
  const breakStart  = req.body.startingBreak 
    ? (Number(req.body.startingBreak.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.startingBreak.split(':')[1]) * 60 * 1000)
    : null;
  const breakEnd    = req.body.startingBreak
    ? (Number(req.body.endingBreak.split(':')[0]) * 60 * 60 * 1000) + (Number(req.body.endingBreak.split(':')[1]) * 60 * 1000)
    : null;

  const time_start  = new Date(d + t1);
  const time_end    = new Date(d + t2);
  const date        = new Date(d);
  const break_start = breakStart ? new Date(breakStart + d) : undefined;
  const break_end   = breakEnd ? new Date(breakEnd + d) : undefined;
  const workedHours = (time_end - time_start) - (breakEnd - breakStart);

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
      invoice_id: undefined,
      break_start,
      break_end,
      worked_hours: workedHours
    },{
      ignoreUndefined: true
    }
    );

    await newClockin.save();

    // send email to the user about the information just punched
    const formatDT = require("../helpers/formatDT.js");
    Email.sendClockinEmail(`Clockin added - ${clientExist.type_kid ? clientExist.nickname : clientExist.name}: ${formatDT.showDate(newClockin.date)} - ${formatDT.showTime(newClockin.time_start)}`, newClockin, userExist, clientExist);
    
    // everything is ok, so lets fe knows it
    return res.json({
      message : "Clockin has been created.",
      user    : userExist.name,
      client  : clientExist.name
    });

  } catch(err) {    // if some trouble happens
    console.trace("Error: ", err.message);
    return res.status(200).json({
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
  const clockinId = req.body.clockinId;
  const userId    = req.userData.userId;
  const userAdmin = req.userData.admin;

  try {
    const clockinToBeDeleted = await Clockin
      .findById(clockinId);
    if (!clockinToBeDeleted || clockinToBeDeleted.length < 1)
      throw (`ECKD01: Clockin NOT found.`);

    if ((userId != clockinToBeDeleted.user_id) && (!userAdmin))
      throw (`ECKD02: Clockin does not belong to your User.`);

  } catch(err) {
    return res.send({
      error: err
    });
  }

  try {
    const clockinDeleted = await Clockin.deleteOne({ _id: clockinId});

    if (clockinDeleted.deletedCount) {      
      return res.send({
        message: `Clockin has been deleted`
      });
    } else
      throw (`ECKD04: Something bad with Clockin id <${clockinId}>`);

  } catch (err) {
    return res.send({
      error: err
    })
  }
}


// it gets all clockins from the system - on purpose with no auth
const get_clockins_by_invoice = async (req, res) => {
  console.log("inside clockins get_all");
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
      else {
        // https://stackoverflow.com/questions/6502541/mongodb-query-multiple-collections-at-once
        // this code works - BEFORE doing a $lookup
        // allClockins = await Clockin
          // .find({ 
          //   user_id: userId,
          //   date: {
          //     $gte: dateStart,
          //     $lte: dateEnd
          //   },
          //   client_id: clientId
          // })
          // .select(" date time_start time_end rate notes invoice_id client_id user_id ");
        allClockins = await Clockin
          .aggregate([
            { $match: 
              {
                user_id: mongoose.Types.ObjectId(userId),
                date: {
                  // $gte: "2019-05-06T00:00:00.000Z",
                  // $lte: "2020-01-18T00:00:00.000Z"
                  $gte: dateStart,
                  $lte: dateEnd
                },
                client_id: mongoose.Types.ObjectId(clientId)
              }
            },
            { $lookup: 
              {
                from: "invoices",
                localField: "invoice_id",
                foreignField: "_id",
                as: "invoice"
              }
            },
            {
              $unwind: {
                path :'$invoice', 
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $project: {
                    "invoice.__v": 0,
                    // "invoice._id": 0,
                    "invoice.date": 0,
                    "invoice.date_start": 0,
                    "invoice.date_end": 0,
                    "invoice.notes": 0,
                    "invoice.status": 0,
                    "invoice.total_cad": 0,
                    "invoice.client_id": 0,
                    "invoice.user_id": 0
                }
            }
          ])
          .sort({date: 1});
      }
  // console.log("ALLCLOCKINS", allClockins);
      if (!allClockins || allClockins.length < 1) {
        return res.status(200).json({
          message: `No clockins at all.`
        });
      }
      // const invoiceCode = await Invoice
      //   .findById(allClockins.)
  
      if (clientId) {
        const client = await Client
          .findById( clientId )
          .select(" nickname ");
          
  
  // console.clear();
  // console.log("--------------------------------------------------------");
  // let totalCadTmp = 0;
  // allClockins.forEach(async (clockin, i) => {
  // // console.log(allClockins[i]);
  //   const t = clockin.worked_hours 
  //               ? ((clockin.worked_hours / 3600000) * clockin.rate)
  //               : ((clockin.time_end - clockin.time_start) / 3600000) * clockin.rate;
  //   totalCadTmp += t;
  // console.log(i + 1 , t, "--> totalCadTmp", totalCadTmp, " - ", clockin.date);
  // if (i === 4 || i === 5) console.log(clockin);
  // });
  
        return res.status(200).json({
          count: allClockins.length,
          allClockins,
          client: client.nickname });
        };
  
      return res.status(200).json({
        count: allClockins.length,
        allClockins
      });
    
    } catch(err) {
      console.log("Error => ", err.message);
      return res.status(422).json({
        error: "EACK02: Something got wrong."
      });
    }
  }


module.exports = {
  get_all,
  get_one,
  clockin_add,
  clockin_delete
  // get_clockins_by_invoice
}