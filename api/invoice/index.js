"use strict";
const mongoose = require("mongoose");


const Clockin = mongoose.model("Clockin", mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  date: {
    type      : Date,
    required  : true
  },
  
  time_start: {
    type      : Date,
    required  : true
  },
  
  time_end: {
    type      : Date,
    required  : true
  },
  
  rate: {
    type      : Number,
    required  : true
  },
  
  notes: {
    type: String
  },
  
  invoice_id: {
    type      : mongoose.Schema.Types.ObjectId,
    ref       : "Invoice",
    required  : false
    // type: String
  },
  
  client_id: {
    type      : mongoose.Schema.Types.ObjectId,
    ref       : "Client",
    required  : true
  },
  
  user_id: {
    type      : mongoose.Schema.Types.ObjectId,
    ref       : "User",
    required  : true
  },

  worked_hours: {
    type      : Number,
    required  : true
  },

  break_start: {
    type      : Date
  },

  break_end: {
    type      : Date
  },

  company_id: {
    type      : mongoose.Schema.Types.ObjectId,
    ref       : "Client"
  }

  })
);



const User = mongoose.model("User", mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },

    admin: {
      type: Boolean,
      default: false
    },

    name: {
      type: String
    },
    
    email: { 
      type: String, 
      required: true,
      createIndexes: true,
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
    password: { 
      type: String, 
      required: true
    },
    
    deleted: {
      type: Boolean
    },

    address: {
      type: String,
      // required: true
    },

    city: {
      type: String,
      // required: true
    },

    postal_code: {
      type: String,
      // required: true
    },

    phone: {
      type: String,
      // required: true
    },

    code: {
      type: String
    },

    code_expiry_at: {
      type: Number
    }
  })
);



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



const Invoice = mongoose.model("Invoice", mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  date: {
    type: Date,
    required: true
  },

  date_start: {
    type: Date,
    required: true
  },
  
  date_end: {
    type: Date,
    required: true
  },
  
  notes: {
    type: String
  },
  
  total_cad: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    required: true
  },
  
  code: {
    type: String,
    required: true
  },
  
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date_delivered: {
    type: Date
  },

  date_received: {
    type: Date
  },

  cad_adjustment: {
    type: Number    
  },

  reason_adjustment: {
    type: String
  },

  for_company: {
    type  : Boolean
  }
  })
);



const checkUserFunction = async(id) => {
    try {
      const checkUser = await User
        .find({ _id: mongoose.Types.ObjectId(id) });

      if (checkUser.length < 1)
        throw({ localError : `Error UH01: User <${id}> does not exist` });
        
      return ({
        result: true,
        checkUser: checkUser[0]
      });

    } catch(error) {
      return ({ error: error.localError || error.message || error});
    }
}



const checkClientFunction = async(id, userId) => {
  // console.log("inside CLIENTTT CHECK");
    try {
      const checkClient = await Client
        .find({ _id: id });
  
      if (checkClient.length < 1)
        throw({ localError: "Error CH01: Client does not exist"});
  
      return ({
        result: true,
        checkClient: checkClient[0]
      });
      
    } catch(error) {
      // console.log("Error: ", error.message);
      return ({ error: error.localError || error.message || error });
    }
}



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
    // console.log("Error tokennnnn: ", error);   // too big message. It's better without it due to avoid polluting the screen.
    return ({
      localError: ((error.localError) || "Error ECA02: Auth has failed. Middleware")
    });
  }
};



const showDate = incomingDate => {

  // console.log("INSIDE formatDate component");
      // console.log(">>>>>> incomingDate", incomingDate);
          const date = new Date(incomingDate);
      // console.log("===", date, "=", date.toUTCString());
      // the error is because month is taking the date before convert it to UTC
      // solved with the below code
      // need to create a function componenet to have this as a pattern for each date in the system, i.e. "Jan 01, 2020"
          // const month = date.toLocaleString('default', { month: 'short' });
          const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const day = date.getUTCDate() > 9 ? date.getUTCDate() : `0${date.getUTCDate()}`;
          return(`${month[date.getUTCMonth()]} ${day}, ${date.getUTCFullYear()}`);
        }
  


const showTime = incomingTime => {
    const time = new Date(incomingTime);
    return((time.getUTCHours() < 10 
                ? ("0" + time.getUTCHours()) 
                : time.getUTCHours()) 
            + ":" + 
            (time.getUTCMinutes() < 10 
                ? ("0" + time.getUTCMinutes()) 
                : time.getUTCMinutes()));
}



const checkInvoiceCode = async (userId, clientId) => {
  // it reverses the array to find from the end to begin

  try {
    const allInvoices = await Invoice.find(
      {
        user_id   : userId,
        client_id : clientId,
      }
    );

    if (!allInvoices || allInvoices.length < 1) return null;

    // it goes to invoice collection and gets the most recent invoice
    const theMostRecentInvoiceCode = allInvoices[allInvoices.length - 1].code;

    // it checks whether the code ends in a number, if so, it adds 1 to it
    const codeArray = theMostRecentInvoiceCode.split("");
    let numberPart  = [];
    let stringPart  = "";

    for (let x = codeArray.length - 1; x >= 0; x--) {
      if (isNaN(codeArray[x])) {

        // if there is no number, it returns the invoice code
        if (x === codeArray.length - 1) return codeArray.join("");

        stringPart = codeArray.slice(0, (codeArray.length - numberPart.length)).join("");
        break;
      }
      
      numberPart = [codeArray[x], ...numberPart];
    }

    const originalNumberPosition = numberPart.length;  
    const number = Number(numberPart.join("")) + 1;
    let numberArray = number.toString().split("");

    if (numberArray.length < originalNumberPosition) {
      while(numberArray.length !== originalNumberPosition) {
        numberArray = [0, ...numberArray];
      }
    }

    // here, it returns an object meaning it has a number added
    const newCode = {
      newCode: `${stringPart}${numberArray.join("")}`
    };

    return(newCode);
  } catch (error) {
    // console.log("catch on checkInvoiceCode");
    return null;
  }
}



module.exports = async (req, res) => {
  const { method }  = req;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })


    // here, it only validates the user by its token
      const token = req.headers.authorization.split(" ")[1];

      const checkUser = await checkAuth(token);

      if (checkUser.localError) throw({localError: checkUser.localError});

      const userId = checkUser.userId;

      switch (method) {
        case "GET":
          {
            const 
              clientId  = req.query.clientId,
              dateStart = new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
              dateEnd   = new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");

            try {
              let allInvoices = await Invoice
                  .find({ 
                    user_id   : userId,
                    client_id : clientId,
                    date: {
                      $gte: dateStart,
                      $lte: dateEnd
                    },
                  })
                  // .select(" date date_start date_end notes total_cad status code")
                  .sort({date: 1});

              if (!allInvoices || allInvoices.length < 1) {
                res.status(200).json({
                  message: `No Invoices at all.`
                });

              } else {
                res.status(200).json({
                  count: allInvoices.length,
                  allInvoices
                });
              }

            } catch(err) {
              throw ({ localError: "EIGA01: Something got wrong."});
            }

            break;
          }


        case "POST":
          {
            const {
              dateStart,
              dateEnd,
              notes,
              clientId,
              // company,
              code,
              clockinArray
            } = req.body;

            const date = (req.body.date ? (new Date(req.body.date)) : (new Date()));

            // it checks whether user is OK and grab info about them which will be used later
            const temp_user   = await checkUserFunction(userId);
            if (temp_user.error)
              throw({ localError: temp_user.error});
            const userExist   = temp_user.checkUser;

            // it checks whether client is OK and grab info about them which will be used later
            // const client_id     = req.body.clientId;
            const temp_client   = await checkClientFunction(clientId, userId);
            if (temp_client.error)
              throw({ localError: temp_client.error});
            const clientExist   = temp_client.checkClient;

          // if (1) return res.json({error: "wait!"})
            /**
             * it checks whether there is invoice for this user and client with the same code
             * if so, it returns a message to the user asking to them to change the code
             */
            try {
              const checkInvoiceCode = await Invoice
                .find({
                  user_id   : userId,
                  client_id : clientId,
                  code
                });

              if (checkInvoiceCode.length && checkInvoiceCode.length > 0)
                throw({ localError: "This code is already been used in other invoice for this client."});
              
            } catch(error) {
              throw({ localError: error.localError || "Error EIADD07: SOmething bad with invoice code."});
            }

            let clockins = clockinArray || "";

            if (!clockinArray) {
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

                if (clockins.length < 1) {
                  res.status(208).json({
                    error: "No clockins at all.",
                    user: userExist.name,
                    client: clientExist.name
                  });

                  break;
                }

              } catch(error) {
                throw({ localError: "EIADD06: Something got wrong." });      
              }
            }


            // lets record invoice after User and Client validation
            try {
              const newInvoice = new Invoice({
                _id: new mongoose.Types.ObjectId(),
                date,
                date_start: dateStart,
                date_end: dateEnd,
                notes,
                status: "Generated",
                total_cad: 0,
                code,
                client_id   : clientId,
                user_id     : userId,
                // for_company : company || undefined
              });

              await newInvoice.save();

              // this is the old way.
              // PROS: it would be possible to change the rate in the middle of a period because each day has a time and a total cad
              // CONS: doing each day, it rounds the total cad at the end of a period.
              // I checked this while working to FedEx. Maybe for Manpower had some situation, but there I received daily.
              // *** The better solution should be the user has to set if the payment is daily or in a period ***

              // let totalCadTmp = 0;
              // clockins.forEach(async (clockin, i) => {
              //   totalCadTmp += clockin.worked_hours 
              //                   ? ((clockin.worked_hours / 3600000) * clockin.rate)
              //                   : ((new Date(clockin.time_end) - new Date(clockin.time_start)) / 3600000) * clockin.rate;


              // new solution below
              // first sum up the hours and round it at the end of a period
              // then, multiple the total hours by the rate
              // still keeping the worked_hours checking
              // *** sometimes it is better (for the client instead the user), to have round each day, others it is the opposite
              // *** This type of situation should be better discussed in a contract, saying it is daily or in a period
              // here, let's assume the hours will be sum up and rounded at the end of a period and multiplied by the hourly rate
              let totalTime = 0;
              clockins.forEach(async (clockin, i) => {
                totalTime += clockin.worked_hours 
                                ? ((clockin.worked_hours / 3600000))
                                : ((new Date(clockin.time_end) - new Date(clockin.time_start)) / 3600000);
          /**
           * the line above should be changed for just take worked_hours whrn all current clockins hav generated invoices
           * deadline = march-2020
           */

                await Clockin
                  .updateOne({
                    _id: clockin._id
                  }, {
                    $set: {
                      invoice_id: newInvoice._id
                    }
                  });
              });
              
              const totalCadTmp = totalTime * clockins[0].rate;

              await Invoice
                .updateOne({
                  _id: newInvoice._id
                }, {
                  $set: {
                    total_cad: totalCadTmp.toFixed(2)
                  }
                });

              res.json({
                message: `Invoice <${newInvoice._id}> has been created.`,
                user: userExist.name,
                client: clientExist.name
              });

            } catch(error) {
              console.trace("............Error: ", error);
              throw({ localError: "EIADD07: Something wrong with invoice's data."});
            };

            break;
          }


        case "PATCH":
          {

            // PATCH modify_status
            const { flag } = req.body;

            const invoiceId  = req.query.invoiceId;
            
              // this try is for check is the invoiceId passed from the frontend is alright (exists in database), plus
              //  check whether either the invoice to be changed belongs for the user or the user is admin - if not, not allowed to change invoice's data
              let invoice = "";
              try {
                invoice = await Invoice
                  .findById(invoiceId);

                if (!invoice)
                  throw ({ localError: `Invoice <id: ${invoice.code}> does not exist.` });
                  
                if ((userId != invoice.user_id) && !userAdmin)
                  throw({ localError: `Invoice <id: ${invoice.code}> belongs to another user.` });
            
              } catch(error) {
                throw({ localError: (
                  (invoiceId.length !== 24) 
                    ? "InvoiceId mystyped." 
                    : (error.localError || "EIMS: Something got wrong.")) });
              }

              try {
                let invoiceToBeChanged;
                
                if (flag === "modify_status") {
                  const status = req.body.newStatus;

                  invoiceToBeChanged = (req.body.dateDelivered
                    ?
                      await Invoice
                        .updateOne(
                          {
                            _id: invoiceId
                          }, 
                          {
                            $set: {
                              status,
                              date_delivered: req.body.dateDelivered
                            }
                        })
                    :
                      await Invoice
                        .updateOne(
                          {
                            _id: invoiceId
                          }, {
                            $set: {
                              status,
                              date_received: req.body.dateReceived
                            }
                          })
                  );
                } else if (flag === "invoice_edit") {
                  const {
                    code,
                    cad_adjustment,
                    reason_adjustment
                  } = req.body;
            
                  
                  invoiceToBeChanged = await Invoice
                    .updateOne({
                      _id: invoiceId
                    }, {
                      $set: {
                          code,
                          cad_adjustment,
                          reason_adjustment,
                      }
                    });
                }
            
                if (invoiceToBeChanged.nModified) {
                  res.json({
                    message: `Invoice <${invoice.code}> has been modified.`
                  });
                } else {
                  res.json({
                    message: `Invoice <${invoice.code}> not changed.`
                  });
                }
              } catch(error) {
                console.trace("Error: ", error.message || error);
                throw({ localError: error.localError || "ECM02: Something bad happened. Try again later."});
              }

            break;
          }
          
        case "DELETE":
          {
            const invoiceId = req.query.invoiceId;

            try {
              await Invoice
                .deleteOne({ _id: invoiceId});
          
              await Clockin
                .updateMany(
                  { invoice_id: invoiceId}, 
                  { $unset: 
                    { invoice_id: 1}
                  }
                );
          
              res.send({message: "OK"});
          
            } catch(error) {
              console.trace(".................. Error:", error);
              throw({ localError: "Error EIDE03: Something went wrong."});
            }

            break;
          }
        
        default:
          // console.log("user.js DEFAULT!!!!");
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


