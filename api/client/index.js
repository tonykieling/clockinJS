"use strict";
const { compareSync } = require("bcrypt");
const mongoose    = require("mongoose");


const Client = mongoose.model("Client", mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    
    name: {
      type: String,
      required: true
    },

    nickname: {
      type: String
      // required: true
    
    },
    birthday: {
      type: Date
      // type: String
    },
    
    mother: {
      type: String
      // required: true
    },
    
    mphone: {
      type: String
      // required: true
    },
    
    memail: {
      type: String
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
    father: {
      type: String
      // default: `Client's-father`
    },
    
    fphone: {
      type: String
    },
    
    femail: {
      type: String
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    consultant: {
      type: String
      // required: true
    },
    
    cphone: {
      type: String
      // required: true
    },
    
    cemail: {
      type: String
      // required: true,
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
    default_rate: {
      // type: Number
      type: String
      // required: true
    },
    
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    deleted: {
      type: Boolean
    },
    
    invoice_sample: {
      type: String
    },

    type_kid: {
      type: Boolean
    },


    
    email: {
      type: String
    },

    address: {
      type: String
    },

    city: {
      type: String
    },

    province: {
      type: String
    },

    postal_code: {
      type: String
    },

    phone: {
      type: String
    },

    type_of_service: {
      type: String
    },

    inactive: {
      type: Boolean
    },

    showRate: {
      type    : Boolean,
      default : true
    },

    showNotes: {
      type    : Boolean,
      default : true
    },

    linked_company: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : "Client"
    },

    rate_as_per_company : {
      type    : Boolean
    },

    isCompany : {
      type  : Boolean
    }
  })
);



// it validates the token and returns the decoded one 
const tokenValidation = async (token) => {
  const jwt = require("jsonwebtoken");

  // console.log("tokenValidationnnnnnn: ", token);
  // console.log("  process.env.JWT_KEY::", process.env.JWT_KEY);
  try {
    const decodedToken  = jwt.verify(token, process.env.JWT_KEY);
// console.log("  decodedToken::", decodedToken);
    return decodedToken;
  } catch(err) {
    return false;
  }
};


const checkAuth = async (token) => {
  try {
    const decodedToken  = await tokenValidation(token);

    if (!decodedToken)
      throw({localError: "Error ECA01: Token expired"});
    
    return decodedToken;

  } catch(error) {
    return ({
      localError: ((error.localError) || "Error ECA02: Auth has failed. Middleware")
    });
  }
};


module.exports = async (req, res) => {
  const { method }  = req;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })

      // console.log("==> req.headers", req.headers);


    // here, it only validates the user by its token
      const token = req.headers.authorization.split(" ")[1];
      // console.log("token=== ", token);

      const checkUser = await checkAuth(token);
// console.log("checkUser==", checkUser);
      if (checkUser.localError) throw({localError: checkUser.localError});

      const userId = checkUser.userId;


      switch (method) {
        case "GET":
          // it is working good



          // console.log(" @GET clientId")
          // console.log("=========clientId", clientId, checkUser.userId, userId);


          // if (clientId) {

          //   //  have not tested yet
          //   try {
          //     if (clientId.length !== 24)
          //       throw({localError: "ECGO04: ClientId mystyped."});

          //     const client = await Client
          //       .find({ _id: clientId});
          
          //     if (!client || client.length < 1)
          //       throw({localError: `ECGO02: Client <id: ${clientId}> does not exist.`});
          
          //     res.status(200).json({
          //       message: client
          //     });
          //   } catch(error) {
          //     console.log("Error => ", error);
  
          //     res.status(200).json({
          //       error: ((error.localError) || ("ECGO05: Something got wrong."))
          //     });
          //   }
          // } else {

            // it is working
            // console.log(" @@@@@GET client get_all", userId);
            

            const askInvoiceSample = req.headers.askinvoicesample || false;

            try {
              let allClients = null;

              if (askInvoiceSample.toLowerCase() === "true") {
                allClients = await Client
                  .find({ user_id: userId});      // it has to be for only that user
              } else {
                allClients = await Client
                  .find({ user_id: userId}, { invoice_sample: 0});      // it has to be for only that user
                  // .select(" name nickname mother consultant ")
              }

              if (!allClients || allClients.length < 1) {
              // if (allClients || allClients.length < 1) {
                throw({
                  message: "No clients at all, please add Clients."
                });
              } else {
                res.status(200).json({
                  count: allClients.length,
                  message: allClients
                });
              }

            } catch (error) {
              if (error.message) {
                res.json({ message: error.message });
              } else {
                throw({
                  localError: ((error.localError) || "ECGO01: Something got wrong.")
                });
              }
            }
          // }

          break;
          
        case "POST":
          {
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
          
                  // linkedCompany,
                  // rateAsPerCompany
              } = req.body;

            // const userId = checkUser.userId
            const birthday = (new Date(req.body.birthday).getTime()) ? new Date(req.body.birthday) : undefined;
          
            try {
              const clientExistName = await Client
                .find({ name });

              const clientExistNickname = 
                typeKid 
                  ? await Client
                    .find({ nickname }) 
                  : null;

              if (clientExistName.length > 0)
                throw ({ localError: `Client <name: ${name}> already exists.` });
                // throw new Error(`Client <name: ${name}> already exists.`); // this would be best because it is a pattern
                // but I should keep consistency and the way I've been using works, too.

              if (req.body.typeKid && clientExistNickname.length > 0)
                throw ({ localError: `Client <nickname: ${nickname}> already exists.` });

          
            } catch(error) {
              throw ({ localError: error.localError || error.message || error });
            }
          
            //it adds the new client
            try {
              const newClient = new Client({
                _id           : new mongoose.Types.ObjectId(),
                name,
                nickname, 
                birthday, 
                mother, 
                mphone        : mPhone, 
                memail        : mEmail, 
                father, 
                fphone        : fPhone, 
                femail        : fEmail, 
                consultant, 
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
                type_of_service : typeOfService
              });
          
            await newClient.save();
        
            res.json({
              message: `Client <${newClient.name}> has been created.`,
              newClient
            });

          } catch(error) {
            throw ({ localError: (error.localError || "ECAD02: Something wrong with client's data.") });
          };

          break;
        }


      
        case "PATCH":
          {
            const {
              clientId,
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
              // postal_code   : postalCode,
              // type_of_service : typeOfService,
              postal_code,
              type_of_service,
              inactive,
              showRate,
              showNotes
            } = req.body;

            const birthday = req.body.birthday ? new Date(req.body.birthday) : undefined;
console.log("change client's data:", req.body);
            try {
          
              const client = await Client
              .findById(clientId);

              if (!client || client.length < 1)
                throw({ localError: `Error CM01: Client <id: ${clientId}> does not exist.`});

              if (userId.toString() !== client.user_id.toString())
                throw({ localError: `Error CM02: Client <id: ${clientId}> belongs to another user.` });

          
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
                    mother      : mother && mother.trim(),
                    mphone      : mPhone && mPhone.trim(),
                    memail      : mEmail && mEmail.trim(),
                    father      : father && father.trim(),
                    fphone      : fPhone && fPhone.trim(),
                    femail      : fEmail && fEmail.trim(),
                    consultant  : consultant && consultant.trim(), 
                    cphone      : cPhone && cPhone.trim(),
                    cemail      : cEmail && cEmail.trim(),
          
                    email           : email && email.trim(),
                    phone           : phone && phone.trim(),
                    city            : city && city.trim(),
                    address         : address && address.trim(),
                    province        : province && province.trim(),
                    // postal_code     : postalCode && postalCode.trim(),
                    // type_of_service : typeOfService && typeOfService.trim(),
                    postal_code,
                    type_of_service,

                    inactive        : inactive === false ? false : (inactive == true ? true : undefined),
                    showRate        : showRate || false,
                    showNotes       : showNotes || false
                  }, 
                  {
                    runValidators: true,
                    ignoreUndefined: true
                  }
                );
console.log("======> clientToBeChanged", clientToBeChanged);
                if (clientToBeChanged.nModified) {
                  const clientModified = await Client
                    .findById({ _id: clientId});
  
                  if (typeKid)
                    clientModified.birthday = Date.parse(clientModified.birthday);
          
                  res.json({
                    message: `Client <${clientModified.nickname}> has been modified.`,
                    newData: clientModified
                  });
                } else
                  res.status(200).json({
                    message: "Client NOT changed - no new data."
                  });
          
            } catch(error) {
              console.trace(error.inactive.message);
              throw({ localError: "Error CM04: Somethiong happened, please try again later"});
            }

          break;
        }


      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    // console.log("most upper level - errorrrrrrrrrrrrrrr: ", error);
    res.json({
      error: (error.localError || error.message || error)
    });
  } finally {
    // console.log("........disconnecting............");
    await mongoose.disconnect();
  }

};


