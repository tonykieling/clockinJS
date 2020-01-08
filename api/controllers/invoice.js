const mongoose  = require("mongoose");

const Invoice   = require("../models/invoice.js");
const Clockin   = require("../models/clockin.js");
const User      = require("../models/user.js");
const Client    = require("../models/client.js");

// https://youtu.be/YK-GurROGIg
// @ts-check    // it makes the type checking mandatory for that piece of code
// @type {Array<number>}
// @type {{id: number, anotherField: string, oneMore: number|boolean}}   //=> it should be place just before an object declaration
// templates:
  // node_modules/jsdoc/templates // copy the default and paste it into the the code for a new directory
  // go to jsdoc.json and set the template as:
    // "template": "name-of-the-dir"   / this should be inside "opts"

/**
 * it gets all users from the system - on purpose with no auth
 * @param {[String]} req.headers.authorization 
 * @param {*} res 
 * @returns
 */
const get_all = async (req, res) => {
console.log("GET_ALL Invoices");
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
  const 
    clientId  = req.query.clientId,
    dateStart = new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
    dateEnd   = new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");

  try {
    let allInvoices = null;
    if (userAdmin)
      allInvoices = await Invoice
        .find()
        .select(" date date_start date_end notes total_cad user_id status ");
    else
      allInvoices = await Invoice
        .find({ 
          user_id   : userId,
          client_id : clientId,
          date: {
            $gte: dateStart,
            $lte: dateEnd
          },
        })
        .select(" date date_start date_end notes total_cad status code");

    if (!allInvoices || allInvoices.length < 1)
      return res.status(200).json({
        message: `No Invoices at all.`
      });

    res.status(200).json({
      count: allInvoices.length,
      allInvoices
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "EIGA01: Something got wrong."
    });
  }
}


// it gets one user - on purpose with no auth
const get_one = async (req, res) => {
  const invoiceId  = req.params.invoiceId;
  const userAdmin  = req.userData.admin;
  const userId     = req.userData.userId;  
  
  try {
    const invoice = await Invoice
      .findById(invoiceId)
      .select(" date date_start date_end notes total_cad user_id ");

    if (!invoice || invoice.length < 1)
      return res.status(409).json({
        error: `EIGO01: Invoice <id: ${invoiceId}> does not exist.`
      });
    if (userId !== invoice.user_id && !userAdmin)
      return res.status(409).json({
        error: `EIGO02: Invoice <id: ${invoiceId}> belongs to another user.`
      });

    res.status(200).json({
      message: invoice
    });
  } catch(err) {
    console.log("Error => ", err.message);
    if (invoiceId.length !== 24)
      return res.status(422).json({
        error: "EIGO02: invoiceId mystyped."
      });  
    res.status(422).json({
      error: "EIGO03: Something got wrong."
    });
  }
}


// it creates a invoice document on mongoDB
/* 
list of actions:
 1- validate User
 2- validate Client
 - list of clockins for the data range
 - grab the total_cad
 - generate invoice_id
 - write down the total_cad in the invoice
 - write down the invoice_id in each clockin
*/
const invoice_add = async (req, res) => {
console.log("Inside Invoice_add, body:", req.body);
const date1 = new Date();
console.log("date1 =", date1);
console.log("req.userData", req.userData);
console.log("req.body:", req.body);
// res.send("OK");
// return;
  const {
    date,
    dateStart,
    dateEnd,
    notes,
    clientId,
    code
  } = req.body;
  const userId = req.userData.userId

  // check for the User
  let userExist = "";
  try {
    userExist = await User
      .findOne({ _id: userId });
    if (!userExist)
      return res.status(403).json({
        error: `EIADD01: User <${userId}> does not exist`
      });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `EIADD02: Something got wrong`
    });
  }

  // check for the Client
  // admin is able to insert a INVOICE for another user
  let clientExist = "";
  try {
    clientExist = await Client
      .findOne({ _id: clientId });
    if (!clientExist)
      return res.status(403).json({
        error: `EIADD03: Client <${clientId}> does not exist`
      });

    // check whether the Client belongs to the User
    if (clientExist.user_id != userId)
      return res.status(403).json({
        error: `EIADD04: Client <${clientExist.name}> does not belong to User <${userExist.name}>.`
      });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `EIADD05: Something got wrong.`
    });
  }


  let clockins = [];
  try {
    clockins = await Clockin
      .find({
        client_id: clientId,
        user_id: userId,
        date: {
          $gte: dateStart,
          $lte: dateEnd
        }
      });

    if (clockins.length < 1)
      return res.status(208).json({
        message: "No clockins at all.",
        user: userExist.name,
        client: clientExist.name
      });

  } catch(err) {
    return res.status(409).json({
      error: `EIADD06: Something got wrong.`
    });
  }


  // lets record invoice after User and Client validation
  try {
    const newInvoice = new Invoice({
      _id: new mongoose.Types.ObjectId(),
      date,
      date_start: dateStart,
      date_end: dateEnd,
      notes,
      status: "generated",
      total_cad: 0,
      code,
      client_id: clientId,
      user_id: userId
    });

    await newInvoice.save();

    let totalCadTmp = 0;
    clockins.forEach(async clockin => {
      totalCadTmp += ((clockin.time_end - clockin.time_start) / 3600000) * clockin.rate;
      await Clockin
        .updateOne({
          _id: clockin._id
        }, {
          $set: {
            invoice_id: newInvoice._id
          }
        });
    })

    await Invoice
      .updateOne({
        _id: newInvoice._id
      }, {
        $set: {
          total_cad: totalCadTmp
        }
      });
const date2 = new Date()
console.log("date2 =", date2);
console.log("total time = ", (date2 - date1) / 1000);
    res.json({
      message: `Invoice <${newInvoice._id}> has been created.`,
      user: userExist.name,
      client: clientExist.name
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(422).json({
      error: "EIADD07: Something wrong with invoice's data."
    });
  };
}


// Jan 4th-DEFINITION: Invoice CANNIOT be mofified. If something to change, delete and generate a new one.
// ONLY to change Invoice's status (Generated, Delivered and Paid)
// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
const client_modify = async (req, res) => {
  const invoiceId  = req.params.invoiceId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;  
  
  // this try is for check is the invoiceId passed from the frontend is alright (exists in database), plus
  //  check whether either the client to be changed belongs for the user or the user is admin - if not, not allowed to change client's data
  try {
    const client = await Client
      .findById(invoiceId);

    if (!client || client.length < 1)
      return res.status(409).json({
        error: `Client <id: ${invoiceId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(409).json({
        error: `Client <id: ${invoiceId}> belongs to another user.`
      });

  } catch(err) {
    console.log("Error => ", err.message);
    if (invoiceId.length !== 24)
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
        _id: invoiceId
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
        .findById({ _id: invoiceId})
        .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");
        // .select(" name nickname mother consultant default_rate");

      return res.json({
        message: `Client <${clientModified}> has been modified.`
      });
    } else
      res.status(409).json({
        error: `Client <${invoiceId}> not changed.`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(409).json({
      error: "ECM02: Something bad"
    });
  }
}


// FIRST it needs to check whether the user is admin or the clockin belongs to the user which is proceeding
const invoice_delete = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  const userId    = req.userData.userId;
  const userAdmin = req.userData.admin;

  try {
    const invoiceToBeDeleted = await Invoice
      .findById(invoiceId);

    if (!invoiceToBeDeleted || invoiceToBeDeleted.length < 1)
      return res.status(409).json({
        error: `EIDE01: Invoice <${invoiceId} NOT found.`
      });

    if ((userId != invoiceToBeDeleted.user_id) && (!userAdmin))
        return res.status(409).json({
          error: `EIDE02: Invoice <${invoiceId}> does not belong to User <${userId}>.`
        });
  } catch(err) {
    return res.status(409).json({
      error: `EIDE03: Something went wrong.`
    });
  }

  try {
    const clockinDeleted = await Invoice
      .deleteOne({ _id: invoiceId});

    if (clockinDeleted.deletedCount)
      return res.status(200).json({
        message: `Invoice <${invoiceId}> has been deleted`
      });
    else
      throw Error;
  } catch (err) {
    res.status(404).json({
      error: `EIDE04: Something bad with Invoice id <${invoiceId}>`
    })
  }
}


module.exports = {
  get_all,
  get_one,
  invoice_add,
  invoice_delete
}