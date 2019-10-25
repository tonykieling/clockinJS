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
        .select(" date date_start date_end notes total_cad ");
    else
      allInvoices = await Clockin
        .find({ user_id: userId})
        .select(" date date_start date_end notes total_cad ");        

    if (!allInvoices || allInvoices.length < 1)
      return res.status(200).json({
        message: `No Invoices at all.`
      });
    
    res.status(200).json({
      message: allInvoices
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
      .select(" date date_start date_end notes total_cad ");

    if (!clockin || clockin.length < 1)
      return res.status(409).json({
        error: `EIGO01: Invoice <id: ${invoiceId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
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
  const {
    date,
    dateStart,
    dateEnd,
    notes,
    status, // (null, created, sent, paid)
    totalCad,
    clientId
  } = req.body;
  const userId = req.userData.userId
  
  // check for the User
  try {
    const userExist = await User
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
  try {
    const clientExist = await Client
      .findOne({ _id: client_id });
    if (!clientExist)
      return res.status(403).json({
        error: `EIADD03: Client <${client_id}> does not exist`
      });
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `EIADD04: Something got wrong`
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
      status,
      total_cad: totalCad,
      client_id: clientId,
      user_id: userId
    });

    await newInvoice.save();

    res.json({
      message: `Invoice ${newInvoice._id} has been created.`
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(422).json({
      error: "EIADD05: Something wrong with invoice's data."
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

    if ((userId != invoiceToBeDeleted.user_id) || (!userAdmin))
      return res.status(409).json({
        error: `EIDE02: Invoice <${invoiceId}> does not belong to User <${userId}>.`
      });
  } catch(err) {
    return res.status(409).json({
      error: `EIDE03: Something went wrong.`
    });
  }

  try {
    const clockinDeleted = await Invoice.deleteOne({ _id: invoiceId});

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