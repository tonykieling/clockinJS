"use strict";
const mongoose    = require("mongoose");

// const bcrypt      = require("bcrypt");

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
    console.log("Error: ", error);   // too big message. It's better without it due to avoid polluting the screen.
    return ({
      localError: ((error.localError) || "Error ECA02: Auth has failed. Middleware")
    });
  }
};


module.exports = async (req, res) => {
  "use strict";
  const { method }  = req;
  // const whatToDo = req.body ? req.body.whatToDo : undefined;

  console.log(" ########### inside /api/client/index.js");
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })

      // console.log("==> req.headers", req.headers);


    // here, it only validates the user by its token
      const token = req.headers.authorization.split(" ")[1];
      // console.log("token=== ", token);

      const checkUser = await checkAuth(token);
      const userId = checkUser.userId;
// console.log("   ----- checkUser", checkUser, "userId", userId);
      if (!userId)
        throw ({localError: ((error.localError) || "Error: Authentication error")});



      switch (method) {
        case "GET":
          // it is working good


          const { clientId } = req.query ? req.query : undefined;

          console.log(" @GET clientId")
          console.log("clientId", clientId);


          if (clientId) {

            //  have not tested yet
            try {
              if (clientId.length !== 24)
                throw({localError: "ECGO04: ClientId mystyped."});

              const client = await Client
                .find({ _id: clientId});
          
              if (!client || client.length < 1)
                throw({localError: `ECGO02: Client <id: ${clientId}> does not exist.`});
          
              res.status(200).json({
                message: client
              });
            } catch(error) {
              console.log("Error => ", error);
  
              res.status(200).json({
                error: ((error.localError) || ("ECGO05: Something got wrong."))
              });
            }
          } else {

            // it is working
            console.log(" @@@@@GET client get_all");
            

            const askInvoiceSample = req.headers.askinvoicesample || false;
// console.log("userId before querying clients::", userId);
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
// console.log(" allClients::: ", allClients.length);

              if (!allClients || allClients.length < 1) {
              // if (allClients || allClients.length < 1) {
                throw({
                  message: "No clients at all."
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
          }

          break;
          
      case "POST":  
        break;  
      
      case "PATCH":
        break;
  
        
      case "DELETE":
        break;


      default:
        console.log("user.js DEFAULT!!!!");
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    console.log("most upper level - errorrrrrrrrrrrrrrr: ", error);
    res.json({
      error: (error.localError || error.message || error)
    });
  } finally {
    // console.log("........disconnecting............");
    await mongoose.disconnect();
  }

};


