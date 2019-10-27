const mongoose  = require("mongoose");

const Invoice   = require("../models/invoice.js");
const Clockin   = require("../models/clockin.js");
const User      = require("../models/user.js");
const Client    = require("../models/client.js");

// it gets all users from the system - on purpose with no auth
get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;

  try {
    let allInvoices = null;
    if (userAdmin)
      allInvoices = await Invoice
        .find()
        .select(" date date_start date_end notes total_cad user_id status ");
    else
      allInvoices = await Clockin
        .find({ user_id: userId})
        .select(" date date_start date_end notes total_cad status");        

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
get_one = async (req, res) => {
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
invoice_add = async (req, res) => {
console.log("req.body", req.body);
// console.log("req.userData", req.userData);
  const {
    date,
    dateStart,
    dateEnd,
    notes,
    clientId
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


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
client_modify = async (req, res) => {
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
invoice_delete = async (req, res) => {
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