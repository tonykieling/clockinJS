const mongoose  = require("mongoose");
const Client    = require("../models/client.js");


// it gets all users from the system - on purpose with no auth
// it is an Admin action
// TODO: apply the Authorization method
const get_all = async (req, res) => {
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;
console.log("---> userId", userId);
  try {
    let allClients = null;
    if (userAdmin)
      allClients = await Client
        .find();
        // .select(" name nickname mother consultant user_id ");
        // .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");

    else
      allClients = await Client
        .find({ user_id: userId});      // it has to be for only that user
        // .select(" name nickname mother consultant ")

    if (!allClients || allClients.length < 1)
      return res.status(200).json({
        message: `No clients at all.`
      });
    
    res.status(200).json({
      count: allClients.length,
      message: allClients
    });
  } catch(err) {
    console.log("Error => ", err.message);
    res.status(422).json({
      error: "ECGO01: Something got wrong."
    });
  }
}


// it gets one user
const get_one = async (req, res) => {
  const clientId  = req.params.clientId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;  
  
  try {
    const client = await Client
      .findById(clientId)
      .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");

    if (!client || client.length < 1)
      return res.status(409).json({
        error: `ECGO02: Client <id: ${clientId}> does not exist.`
      });
    if (userId !== client.user_id && !userAdmin)
      return res.status(409).json({
        error: `ECGO03: Client <id: ${clientId}> belongs to another user.`
      });

    res.status(200).json({
      message: client
    });
  } catch(err) {
    console.log("Error => ", err.message);
    if (clientId.length !== 24)
      return res.status(422).json({
        error: "ECGO04: ClientId mystyped."
      });  
    res.status(422).json({
      error: "ECGO05: Something got wrong."
    });
  }
}


// it creates a client register
const client_add = async (req, res) => {
  const {
        name,
        nickName, 
        birthday, 
        mother, 
        mPhone, 
        mEmail, 
        father, 
        fPhone, 
        fEmail, 
        consultant, 
        cPhone, 
        cEmail, 
        defaultRate
     } = req.body;
  const userId = req.userData.userId
console.log("req.body", req.body, "userId", userId);
//   return res.json({
//     body: req.body,
//     userId
//   })

  // it checks whether the name and nickname are already been used by an user account
  // if so, it returns an error message
  try {
    const clientExist = await Client
      .find({ name, nickname: nickName });
  
    if (clientExist.length > 0)
      return res.status(409).json({ error: `User <name: ${name} nickname: ${nickName}> alread exists.`});
  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(409).json({
      error: `ECAD01: Error CLIENTADD01`
    });
  }

  try {
    const client = new Client({
      _id: new mongoose.Types.ObjectId(),
      name: name || "",
      nickname: nickName || "", 
      birthday: birthday || "", 
      mother: mother || "", 
      mphone: mPhone || "", 
      memail: mEmail || "", 
      father: father || "", 
      fphone: fPhone || "", 
      femail: fEmail || "", 
      consultant: consultant || "", 
      cphone: cPhone || "", 
      cemail: cEmail || "", 
      default_rate: defaultRate || "",
      user_id: userId
    });

    await client.save();

    client.id = client._id;
    res.json({
      message: `Client <${client.name}> has been created.`,
      client
    });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(422).json({
      error: "ECAD02: Something wrong with client's data."
    });
  };
}


// change user data
// input: token, which should be admin
// TODO: the code has to distinguish between admin and the user which has to change their data (only email or email
// for now, only ADMIN is able to change any user's data
const client_modify = async (req, res) => {
  const clientId  = req.params.clientId;
  const userAdmin = req.userData.admin;
  const userId    = req.userData.userId;

  
  // this try is for check is the clientId passed from the frontend is alright (exists in database), plus
  //  check whether either the client to be changed belongs for the user or the user is admin - if not, not allowed to change client's data
  try {
    const client = await Client
      .findById(clientId);

    if (!client || client.length < 1)
      return res.status(200).json({
        error: `Client <id: ${clientId}> does not exist.`
      });
    if (userId.toString() !== client.user_id.toString() && !userAdmin)
      return res.status(200).json({
        error: `Client <id: ${clientId}> belongs to another user.`
      });

  } catch(err) {
    console.log("Error => ", err.message);
    if (clientId.length !== 24)
      return res.status(200).json({
        error: "ClientId mystyped."
      });  
    res.status(200).json({
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
    default_rate
 } = req.body;

  try {
    const clientToBeChanged = await Client
      .updateOne({
        _id: clientId
      }, {
        $set: {
            name: name || "", 
            nickname: nickname || "", 
            birthday: birthday || "", 
            mother: mother || "", 
            mphone: mphone || "", 
            memail: memail || "", 
            father: father || "", 
            fphone: fphone || "", 
            femail: femail || "", 
            consultant: consultant || "", 
            cphone: cphone || "", 
            cemail: cemail || "", 
            default_rate: default_rate || "", 
            user_id: userId
        }
      }, {
        runValidators: true
      });
    
    if (clientToBeChanged.nModified) {
      const clientModified = await Client
        .findById({ _id: clientId})
        .select("name nickname birthday mother mphone memail father fphone femail consultant cphone cemail default_rate user_id");

      return res.json({
        message: `Client <${clientModified.nickname}> has been modified.`,
        newData: clientModified
      });
    } else
      res.status(200).json({
        error: `Client <${clientId}> not changed.`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    res.status(200).json({
      error: "ECM02: Something bad"
    });
  }
}


// FIRST it needs to check whether the user is admin
// it deletes an user account
// need to check whether there is clockin for that invoice to be deleted
// implement soft deletion
const client_delete = async (req, res) => {
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
    return res.status(409).json({
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