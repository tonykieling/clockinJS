const mongoose  = require("mongoose");
const Client    = require("../models/client.js");


// it gets all users from the system - on purpose with no auth
// it is an Admin action
// TODO: apply the Authorization method
const get_all = async (req, res) => {
console.log("inside client get_all");
  const userAdmin   = req.userData.admin;
  const userId      = req.userData.userId;
  const askInvoiceSample = req.headers.askinvoicesample || false;

  try {
    let allClients = null;
    if (userAdmin) {
      allClients = await Client
        .find();
        // .select(" name nickname mother consultant user_id ");
        // .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");
    } else if (askInvoiceSample.toLowerCase() === "true") {
      allClients = await Client
        .find({ user_id: userId});      // it has to be for only that user
    } else {
      allClients = await Client
        .find({ user_id: userId}, { invoice_sample: 0});      // it has to be for only that user
        // .select(" name nickname mother consultant ")
    }

    if (!allClients || allClients.length < 1)
      return res.status(200).json({
        message: `No clients at all.`
      });

// should return birthday as a string yyyy-mm-dd
    return res.status(200).json({
      count: allClients.length,
      message: allClients
    });
  } catch(err) {
    console.log("Error => ", err.message);
    return res.status(200).json({
      error: "ECGO01: Something got wrong."
    });
  }
}


// it gets one user
const get_one = async (req, res) => {
console.log("inside client get_one");

  const clientId  = req.params.clientId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;  
  
  try {
    const client = await Client
      .findById(clientId)
      .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");

    if (!client || client.length < 1)
      return res.status(200).json({
        error: `ECGO02: Client <id: ${clientId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(200).json({
        error: `ECGO03: Client <id: ${clientId}> belongs to another user.`
      });

    res.status(200).json({
      message: client
    });
  } catch(err) {
    console.log("Error => ", err.message);
    if (clientId.length !== 24)
      return res.status(200).json({
        error: "ECGO04: ClientId mystyped."
      });  
    res.status(200).json({
      error: "ECGO05: Something got wrong."
    });
  }
}


// it creates a client register
const client_add = async (req, res) => {
console.log("inside client add");
  // mongoose.set("debug", true);

  const {
        name,
        nickname, 
        mother, 
        mPhone, 
        mEmail, 
        father, 
        fPhone, 
        fEmail, 
        consultant, 
        cPhone, 
        cEmail, 
        defaultRate,
        typeKid,

        email,
        phone,
        address,
        city,
        province,
        postalCode,
        typeOfService,

        linkedCompany,
        rateAsPerCompany
     } = req.body;
     
  const userId = req.userData.userId
  const birthday = (new Date(req.body.birthday).getTime()) ? new Date(req.body.birthday) : undefined;

  try {
    const clientExistName = await Client
      .find({ name });
    const clientExistNickname = 
      typeKid 
        ? await Client
          .find({ nickname }) 
        : null;

    if (clientExistName.length > 0 && userId == clientExistName[0].user_id)
      return res.status(200).json({ error: `Client <name: ${name}> already exists.`});

    if (clientExistNickname && clientExistNickname.length > 0 && userId == clientExistNickname[0].user_id)
      return res.status(200).json({ error: `Client <nickname: ${nickname}> already exists.`});

  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `ECAD01: Error CLIENTADD01`
    });
  }

  //it adds the new client
  try {
    const newClient = new Client({
      _id           : new mongoose.Types.ObjectId(),
      name          : name,
      nickname      : nickname, 
      birthday      : birthday, 
      mother        : mother, 
      mphone        : mPhone, 
      memail        : mEmail, 
      father        : father, 
      fphone        : fPhone, 
      femail        : fEmail, 
      consultant    : consultant, 
      cphone        : cPhone, 
      cemail        : cEmail, 
      default_rate  : defaultRate,
      user_id       : userId,
      type_kid      : typeKid,

      email,
      phone,
      city,
      address,
      province,
      postal_code   : postalCode,
      type_of_service : typeOfService,

      linked_company      : linkedCompany,
      rate_as_per_company : rateAsPerCompany
    });

    // checks if the new client is gonna be linked to a Company Client
    if (linkedCompany)  {
      // if setting a kid for a Company Client, it adds a new boolean field (company) to the the Company Client
      try {
        await Client
          .updateOne(
            { 
              _id: linkedCompany 
            },
            { 
              company : true
            },
            { 
              runValidators   : true,
              ignoreUndefined : true
            }
          );

      } catch(err) {
        console.trace("Error ECAD03: ", err.message);
        return res.json({
          error: "ECAD03: Something wrong with Client's Company data."
        });    
      }
    }

    // *no rollback for both add newClient and update Client to Company
    // as newClient.save comes after the updating Company Client, at least if something happen in this method, the system will send an error.
      // but, if something happen in newClient.save, the Company Client will be set as it and the kid client will not be saved
    await newClient.save();

    return res.json({
      message: `Client <${newClient.name}> has been created.`,
      newClient
    });

  } catch(err) {
    console.trace("Error ECAD02: ", err.message);
    return res.status(200).json({
      error: "ECAD02: Something wrong with client's data."
    });
  };
}


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
const client_modify = async (req, res) => {
console.log("inside client modify");

  const clientId  = req.params.clientId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
  
  // this try is for check is the clientId passed from the frontend is alright (exists in database), plus
  //  check whether either the client to be changed belongs for the user or the user is admin - if not, not allowed to change client's data


  const {
    name,
    default_rate,

    nickname,
    mother, 
    mPhone, 
    mEmail, 
    father, 
    fPhone, 
    fEmail, 
    consultant, 
    cPhone, 
    cEmail, 
    typeKid,

    email,
    phone,
    city,
    address,
    province,
    postal_code   : postalCode,
    type_of_service : typeOfService,
    inactive,
    showRate,
    showNotes
  } = req.body;

  const birthday = req.body.birthday ? new Date(req.body.birthday) : undefined;

  try {

    const client = await Client
    .findById(clientId);
    
    if (!client || client.length < 1)
      return res.status(200).json({
        error: `Error CM01: Client <id: ${clientId}> does not exist.`
      });
    if (userId.toString() !== client.user_id.toString() && !userAdmin)
      return res.status(200).json({
        error: `Error CM02: Client <id: ${clientId}> belongs to another user.`
      });

    const clientToBeChanged = await Client
      .updateOne(
        {
        _id: clientId
        }, 
        {
          name, 
          default_rate: default_rate, 
          user_id: userId,

          nickname, 
          birthday, 
          mother      : mother ? mother.trim() : (client.mother ? "" : undefined),
          mphone      : mPhone ? mPhone.trim() : (client.mphone ? "" : undefined),
          memail      : mEmail ? mEmail.trim() : (client.memail ? "" : undefined),
          father      : father ? father.trim() : (client.father ? "" : undefined),
          fphone      : fPhone ? fPhone.trim() : (client.fphone ? "" : undefined),
          femail      : fEmail ? fEmail.trim() : (client.femail ? "" : undefined),
          consultant  : consultant ? consultant.trim() : (client.consultant ? "" : undefined), 
          cphone      : cPhone ? cPhone.trim() : (client.cphone ? "" : undefined),
          cemail      : cEmail ? cEmail.trim() : (client.cemail ? "" : undefined),

          email           : email ? email.trim() : (client.email ? "" : undefined),
          phone           : phone ? phone.trim() : (client.phone ? "" : undefined) ,
          city            : city ? city.trim() : (client.city ? "" : undefined),
          address         : address ? address.trim() : (client.address ? "" : undefined),
          province        : province ? province.trim() : (client.province ? "" : undefined) ,
          postal_code     : postalCode ? postalCode.trim() : (client.postal_code ? "" : undefined),
          type_of_service : typeOfService ? typeOfService.trim() : (client.type_of_service ? "" : undefined),
          inactive        : inactive === false ? false : (inactive == true ? true : undefined),
          showRate,
          showNotes
        }, 
        {
          runValidators: true,
          ignoreUndefined: true
        }
      );

      if (clientToBeChanged.nModified) {
      const clientModified = await Client
        .findById({ _id: clientId})
        // .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");
      
      if (typeKid)
        clientModified.birthday = Date.parse(clientModified.birthday);

      return res.json({
        message: `Client <${clientModified.nickname}> has been modified.`,
        newData: clientModified
      });
    } else
      res.status(200).json({
        message: `Client NOT changed - no new data.`
      });

  } catch(err) {
    console.trace("Error CM01: ", err.message);
    res.status(200).json({
      error: "Error CM04: Something bad"
    });
  }
}


// FIRST it needs to check whether the user is admin
// it deletes an user account
// need to check whether there is clockin for that invoice to be deleted
// implement soft deletion
const client_delete = async (req, res) => {
console.log("inside client delete");

  if (!req.userData.admin)
    return res.status(401).json({
      error: `Client <${req.userData.email} is not an Admin.`
    });

  const clientId = req.params.clientId;

  let clientToBeDeleted = ""
  try {
    clientToBeDeleted = await Client.findById(clientId);
    if (!clientToBeDeleted || clientToBeDeleted.length < 1)
      throw Error;
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: `ECD01: Client <${clientId}> NOT found.`
    });
  }

  try {
    const clientDeleted = await Client.deleteOne({ _id: clientId});

    if (clientDeleted.deletedCount)
      return res.status(200).json({
        message: `User <${clientId}> has been deleted`,
        name: clientToBeDeleted.name
      });
    else
      throw Error;
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(404).json({
      error: `ECD02: Something bad with Client id <${clientId}>`
    })
  }
}


module.exports = {
  get_all,
  get_one,
  client_add,
  client_modify,
  client_delete
}