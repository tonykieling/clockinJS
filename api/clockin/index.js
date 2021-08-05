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
  console.log("inside USER CHECK, id:", id);
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
      console.log("Error: ", error.message);
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
      console.log("Error: ", error.message);
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
    console.log("Error tokennnnn: ", error);   // too big message. It's better without it due to avoid polluting the screen.
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



const sendClockinEmail = async (subject, clockin, user, client) => {
console.log("----sending email");

  const content = (`
    <div>
      <p>Hi <b>${user.name.split(" ")[0]}</b></p>
      <p>You have just punched in.</p>
      <br>

      <table style="border: 3px double blue; text-align: left; border-collapse: collapse">
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Client</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${client.type_kid ? client.nickname : client.name}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Date</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${showDate(clockin.date)}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Time Start</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${showTime(clockin.time_start)}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Time End</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${showTime(clockin.time_end)}
        </td>
      </tr>
      ${clockin.break_start 
        ?
          `<tr>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              <b>Break Start</b>
            </td>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              ${showTime(clockin.break_start)}
            </td>
          </tr>`
        : ""}
      ${clockin.break_end 
        ?
          `<tr>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              <b>Break End</b>
            </td>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              ${showTime(clockin.break_end)}
            </td>
          </tr>`
        : ""}
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Worked Hours</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${showTime(clockin.worked_hours)}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Rate</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${clockin.rate}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Notes</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${clockin.notes ? clockin.notes : ""}
        </td>
      </tr>
    </table>
    <br>

      <p>Kind regards from</p>
      <h4><a href="https://clockinjs.herokuapp.com">Clockin.js</a> Team :)</h4>
    </div>
  `);
  
  await generalSender(user.email, subject, content);
}



const generalSender = async (to, subject, html) => {
console.log("----email, general sender");
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.password
    }
  });

  try {
    await transporter.sendMail({
      from  : "Clockin.js<clockin.js@gmail.com>",
      to,
      subject,
      html,
    });
  } catch(error) {
    // this error is related to the email part, 
    // it does not mean the system signed up the new user, that mean, the flow goes keeping
    console.trace(error.message || message);
  }
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
    console.log("catch on checkInvoiceCode");
    return null;
  }
}



module.exports = async (req, res) => {
  const { method }  = req;

  console.log(" ########### inside /api/clockin/index.js");
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })

      console.log("==> req.headers", req.headers);
      console.log("==> req.body", req.body);


    // here, it only validates the user by its token
      const token = req.headers.authorization.split(" ")[1];
      // console.log("token=== ", token);

      const checkUser = await checkAuth(token);
console.log("checkUser==", checkUser);
      if (checkUser.localError) throw({localError: checkUser.localError});

      const userId = checkUser.userId;
console.log("userId", userId);

      switch (method) {
        case "GET":
          {
            const { type } = req.query;

            console.log("*-*-*-*-*-*-*- req.query", req.query);

            // res.json({error: "oooopppps"});



            console.log("inside clockins get_general");
            // const userId    = req.userData.userId;
            const 
              // clientId  = req.query.clientId === "undefined" ? undefined : req.query.clientId,
              date          = req.query.date,
              typeQuestion  = req.query.type,
              clientId      = req.query.clientId || req.query.companyId;  
            ;
        
            const
              dateStart = (typeQuestion === "byDate")
                          ? new Date(`${date}T00:00:00.000Z`)
                          : new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
              dateEnd   = typeQuestion === "byDate" 
                          ? new Date(`${date}T23:59:59.000Z`)
                          : new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");
        
            let conditions = "";
        
            // it checks whether the is a company client
            // if so, it will set the condition's query for client_linked_to_company
            if (typeQuestion === "toCompany") {
              const companyId = req.query.companyId
              const clients = await Client
                .find({
                  linked_company: mongoose.Types.ObjectId(companyId)
                })
                .select(" _id ");
console.log("---clients", clients);

              if (clients.length < 1)
                throw({ localError: "Company Client error."});
                // return res.json({error: "Company Client error."});
        

              /**
               * do not recal why i am handling an array of clients instead of one.
               * Why would I need to query more than one client??
               * 
               * so, refactoring to work with one client
               */
              // const clientsArray = clients.map(e => mongoose.Types.ObjectId(e._id));
        
              conditions = {
                // client_id: {$in: clientsArray},
                client_id: {$in: clientsArray},
                date          : {
                  $gte: dateStart,
                  $lte: dateEnd
                },        
              }

            } else if (typeQuestion === "invoiceClockins") {
              const invoiceId = req.query.invoiceId;
              conditions = {
                invoice_id  : mongoose.Types.ObjectId(invoiceId)
              };

              const allClockins = await Clockin
                .aggregate([
                  { $match: conditions },
                  { $lookup: 
                    {
                      from: "clients",
                      localField: "client_id",
                      foreignField: "_id",
                      as: "client"
                    }
                  },
                  {
                    $unwind: {
                      path :'$client',
                      preserveNullAndEmptyArrays: true
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
                    $project:{
                        date            : 1,
                        time_start      : 1,
                        time_end        : 1,
                        rate            : 1,
                        notes           : 1,
                        client_id       : 1,
                        user_id         : 1,
                        break_start     : 1,
                        break_end       : 1,
                        worked_hours    : 1,
                        invoice_id      : 1,
                        invoice         : "$invoice",
                        client_name     : "$client.name",
                        client_nickname : "$client.nickname"
                    } 
                }
                ])
                .sort({ time_start: 1});
console.log(" --- allClockins", allClockins);

              res.json({
                count: allClockins.length,
                allClockins
              });

              break;
            } else {
              console.log("hhhhhhhhhhhhhhhereeeeeeeeeeeeeeeee");


              ///////////
              /////// need to see which query it is running right now
              ////////////////////////
              /////
              ////
              /*

              using get_all
              see getClockins.js to check which endpoint is being queried

              */
              ///////
              /////


              conditions = {
                  user_id   : mongoose.Types.ObjectId(userId),
                  date      :   {
                                  $gte: dateStart,
                                  $lte: dateEnd
                                },
                };

              console.log("conditions", conditions);
            }
        
        
            try {
              const allClockins = await Clockin
                .aggregate([
                  { $match: 
                    conditions
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
                  { $lookup: 
                    {
                      from: "clients",
                      localField: "client_id",
                      foreignField: "_id",
                      as: "client"
                    }
                  },
                  {
                    $unwind: {
                      path :'$client',
                      preserveNullAndEmptyArrays: true
                    }
                  },
                  {   
                    $project:{
                        // _id : 1,
                        date            : 1,
                        time_start      : 1,
                        time_end        : 1,
                        rate            : 1,
                        notes           : 1,
                        client_id       : 1,
                        user_id         : 1,
                        break_start     : 1,
                        break_end       : 1,
                        worked_hours    : 1,
                        invoice_id      : 1,
                        invoice         : "$invoice",
                        client_name     : "$client.name",
                        client_nickname : "$client.nickname"
                    } 
                }
                ])
                .sort({time_start: 1});
console.log(" ----allClockinsssssssss", allClockins.length);
              if (!allClockins || allClockins.length < 1) {
                // throw({ localError: "No clockins at all."});
                res.status(200).json({
                  message: `No clockins at all.`
                });

                break;
              }
        

              const codeSuggestion = req.query.queryLastInvoiceCode ? await checkInvoiceCode(userId, clientId) : null;
        
              // if (clientId) {
              //   const client = await Client
              //     .findById( clientId )
              //     .select(" nickname ");
                  
              //   return res.status(200).json({
              //     count: allClockins.length,
              //     allClockins,
              //     client: client.nickname
              //   });
              // };
        
              res.status(200).json({
                count: allClockins.length,
                allClockins,
                codeSuggestion
              });
            
            } catch(error) {
              console.log("Error => ", error);

              res.status(200).json({
                error: error.localError || "EACK02: Something got wrong."
              });
            }


            break;
          }


        case "POST":
          {

            console.log("inside clockins ADD");

 

            // it checks whether user is OK and grab info about them which will be used later
            const temp_user   = await checkUserFunction(userId);
console.log("temp_user", temp_user);
            if (temp_user.error)
              throw({ localError: temp_user.error});

            const userExist   = temp_user.checkUser;
console.log("userExist", userExist);
          
            // it checks whether client is OK and grab info about them which will be used later
            const client_id     = req.body.clientId;
            const temp_client   = await checkClientFunction(client_id);
            if (temp_client.error)
            throw({ localError: temp_client.error});
            
            const clientExist   = temp_client.checkClient;
console.log("clientExist", clientExist);
          
          
            // lets record clockin after User and Client validation
            const {
              rate,
              notes,
              companyId
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
                worked_hours: workedHours,
                company_id  : companyId
              },{
                ignoreUndefined: true
              }
              );
console.log("newClockin", newClockin);
              await newClockin.save();


              await sendClockinEmail(`Clockin added - ${clientExist.type_kid ? clientExist.nickname : clientExist.name}: ${showDate(newClockin.date)} - ${showTime(newClockin.time_start)}`, newClockin, userExist, clientExist);
              
              // everything is ok, so lets fe knows it
              return res.json({
                message : "Clockin has been created.",
                user    : userExist.name,
                client  : clientExist.name
              });
          
            } catch(error) {    // if some trouble happens
              console.trace("Error: ", error.message);
              throw({ localError: error.localError || "ECKA06: Something wrong with clockin's data." });
            };
            
          }


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
    console.log("........disconnecting............");
    await mongoose.disconnect();
  }
};


