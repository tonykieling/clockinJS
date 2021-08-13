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



const sendClockinEmail = async (subject, clockin, user, client) => {
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
      <h4><a href="https://clockin.tkwebdev.ca">Clockin.js</a> Team :)</h4>
    </div>
  `);
  
  await generalSender(user.email, subject, content);
}



const generalSender = async (to, subject, html) => {
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
    // console.log("catch on checkInvoiceCode");
    return null;
  }
}


//it gets info about the clients
const allClients = async(userId) => {
  try {
    // checks client info
    // onlcy active clients
    const clients = await Client
      .find({
        user_id  : userId,
        inactive: { $ne: true }
      });

    return(clients);
  } catch (error) {
    console.log("Error: Clockin Report - 03 ");
    return ({
      localError: "Error: Clockin Report - 03 "
    });
  }
}


//it queries the dbs the clockins for either a user (all clients) or a client
const queryClockins = async (summary, userId, dateStart, dateEnd, clientId, clientName) => {
  let conditions = {
    user_id: mongoose.Types.ObjectId(userId),
    date: {
      $gte: dateStart,
      $lte: dateEnd
    }
  }

  if (!summary) {
    // it is about only one client
    conditions.client_id = mongoose.Types.ObjectId(clientId);
  }
  else {
    // it is about an arryay of clients
    const clients = clientId.map(e => (
        { 
          client_id: mongoose.Types.ObjectId(e._id)
        }
      )
    );

    conditions["$or"] = [...clients];
   
   
    // conditions = {
    //   user_id: mongoose.Types.ObjectId(userId),
    //   date: {
    //     $gte: dateStart,
    //     $lte: dateEnd
    //   },
    //   $or : [
    //     ...clients
    //     // {client_id: mongoose.Types.ObjectId("5e370d723defb432b11df739")},
    //     // {client_id: mongoose.Types.ObjectId("5f721157660b20000493fce7")},
    //   ]
    // };
  }

  let allClockins = "";
  try {
    // it queries clockins for only active clients
    allClockins = await Clockin
      .find(conditions)
      .sort({date: 1})

  } catch (error) {
    console.log("Error: Clockin Report - 04 ");
    return ({
      localError: "Error: Clockin Report - 04 "
    });
  }


  // it gets client's info
  let client = "";
  if (!clientName && clientId) {
    try {
      // checks client info
      client = await Client
        .findById( clientId );

    } catch (error) {
      console.log("Error: Clockin Report - 05 ");
      return ({
        localError: "Error: Clockin Report - 05 "
      });
    }
  }

  // if no clockins for the client
  if (!allClockins || allClockins.length < 1)
    return ({
      message: `No clockins at all.`,
      client: client ? client.nickname || client.name : clientName
    });


  //below are the report's calculations
  const totalClockins = allClockins.length;

  const totalHours = (allClockins.reduce((a, b) =>
    b.worked_hours 
      ? (a + b.worked_hours) 
      : (a + (new Date(b.time_end) - new Date(b.time_start)))
    , 0)) / 3600000;

  const invoicedClockins = allClockins.filter(e => e.invoice_id);

  const totalClockinsInvoiced = invoicedClockins.length;

  const totalHoursInvoiced    = (invoicedClockins.reduce((a, b) => 
      b.worked_hours
        ? (a + b.worked_hours)
        : (a + (new Date(b.time_end) - new Date(b.time_start)))
    , 0) / 3600000);

  const totalClockinsNoInvoice  = totalClockins - totalClockinsInvoiced;
  const totalHoursNoInvoice     = totalHours - totalHoursInvoiced;

  const result = {
    totalClockins,
    totalHours,
    totalClockinsInvoiced,
    totalHoursInvoiced,
    totalClockinsNoInvoice,
    totalHoursNoInvoice
  }
  if (client || clientName) 
    result.client = client ? (client.nickname || client.name) : clientName;

  return (result);
}




module.exports = async (req, res) => {
  const { method }  = req;
  
  try {
    await mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })

    // here, it only validates the user by its token
      const token = req.headers.authorization.split(" ")[1];
      // console.log("token=== ", token);

      const checkUser = await checkAuth(token);

      if (checkUser.localError) throw({localError: checkUser.localError});

      const userId = checkUser.userId;

      switch (method) {
        case "GET":
          {
            if (req.query.reports) {

              const 
              clientId        = req.query.clientId,
              dateStart       = new Date(req.query.dateStart),
              dateEnd         = new Date(req.query.dateEnd),
              checkAllClients = req.query.checkAllClients;

              let result = {};

              try {
                if (checkAllClients === "true") {
                  // calls the function that proceed for all clients (which are active)
                  const clients = await allClients(userId);

                  // query clockins receives its first param sumarry or not
                  const summary = await queryClockins(true, userId, dateStart, dateEnd, clients);

                  const arrayOfClockinsByClient = await clients.map(e => 
                      queryClockins(false, userId, dateStart, dateEnd, e._id, (e.nickname || e.name))  
                    );

                  const clockinsByClient = await Promise.all(arrayOfClockinsByClient);
              
                  result = {
                    summary,
                    clockinsByClient
                  };
              
                } else {
                  // calls the function for a specific client
                  const summary = await queryClockins(false, userId, dateStart, dateEnd, clientId);
                  result.summary = summary;
                }
              
                result = {
                  ...result,
                  period: {
                    dateStart,
                    dateEnd
                  }
                };
              
                res.json(result);
              } catch (error) {
                throw({ localError: error.message || error});
              }


            } else {
              const typeQuestion = req.query.type;

              const 
                clientId  = req.query.clientId,
                dateStart = (typeQuestion === "byDate")
                            ? new Date(`${req.query.date}T00:00:00.000Z`)
                            : new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
                dateEnd   = typeQuestion === "byDate" 
                            ? new Date(`${req.query.date}T23:59:59.000Z`)
                            : new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");

              let conditions = "";
              // when it is a simple query regarding one day
              if (typeQuestion === "byDate") {
                conditions = {
                  user_id : mongoose.Types.ObjectId(userId),
                  date    : {
                              $gte: dateStart,
                              $lte: dateEnd
                            },
                };
                  
            // console.log("++++++++++++++conditions", conditions);
                          
                try {
                  const allClockins = await Clockin
                    .aggregate([
                      { $match: 
                        conditions
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
                            client_name     : "$client.name",
                            client_nickname : "$client.nickname"
                        } 
                    }
                    ])
                    .sort({time_start: 1});

            // console.log("##########++++++++allclockins:", allClockins);

                  if (!allClockins.length) {
                    res.json({
                      message: "No clockins at all."
                    });
                  } else {
                    res.json({
                      count: allClockins.length,
                      allClockins
                    });
                  }
                } catch(error) {
                  throw({ localError: error.message || error});
                }
              } else if (typeQuestion === "invoiceClockins") {

                const invoiceId = req.query.invoiceId;
                conditions = {
                  invoice_id  : mongoose.Types.ObjectId(invoiceId)
                };

                try {
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
  // console.log("##########++++++++   invoice/clockins  allclockins:", allClockins);

                  res.json({
                    count: allClockins.length,
                    allClockins
                  });
                } catch (error) {
                  throw({ error: error.message || error});
                }

              } else {
                conditions = {
                    user_id   : mongoose.Types.ObjectId(userId),
                    date      : {
                                  $gte: dateStart,
                                  $lte: dateEnd
                                },
                  };      

                try { 
                  let allClockins = null;

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
  // console.log("222222 ##########++++++++   invoice/clockins  allclockins:", allClockins);

                  if (!allClockins || allClockins.length < 1) {
                    throw({ localError: "No clockins at all."});
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

                    res.status(200).json({
                      count: allClockins.length,
                      allClockins,
                      client: client.nickname, 
                      codeSuggestion
                    });

                    break;
                  };

                  res.status(200).json({
                    count: allClockins.length,
                    allClockins
                  });
                
                } catch(error) {
                  throw({ localError: error.localError || "EACK02: Something's got wrong." });
                }
              }
            }

            break;
          }


        case "POST":
          {
            // console.log("inside clockins ADD");

            // it checks whether user is OK and grab info about them which will be used later
            const temp_user   = await checkUserFunction(userId);

            if (temp_user.error)
              throw({ localError: temp_user.error});

            const userExist   = temp_user.checkUser;
          
            // it checks whether client is OK and grab info about them which will be used later
            const client_id     = req.body.clientId;
            const temp_client   = await checkClientFunction(client_id);
            if (temp_client.error)
            throw({ localError: temp_client.error});
            
            const clientExist   = temp_client.checkClient;
          
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

              await newClockin.save();


              await sendClockinEmail(`Clockin added - ${clientExist.type_kid ? clientExist.nickname : clientExist.name}: ${showDate(newClockin.date)} - ${showTime(newClockin.time_start)}`, newClockin, userExist, clientExist);
              
              // everything is ok, so lets fe knows it
              res.json({
                message : "Clockin has been created.",
                user    : userExist.name,
                client  : clientExist.name
              });
          
            } catch(error) {    // if some trouble happens
              throw({ localError: error.localError || "ECKA06: Something wrong with clockin's data." });
            };
            
            break;
          }


        case "DELETE":
          {
            const clockinId = req.body.clockinId;

            try {
              const clockinDeleted = await Clockin.deleteOne({ _id: clockinId});

              if (clockinDeleted.deletedCount) {      
                res.send({
                  message: `Clockin has been deleted`
                });
              } else
                throw ({ localError: `ECKD04: Something bad with Clockin id <${clockinId}>`});

            } catch (error) {
              res.send({
                error: error.localError || error.message || error
              });
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
        error: (error.localError || error.message || error || "General Error. Try again later.")
      });
  } finally {
    // console.log("........disconnecting............");
    await mongoose.disconnect();
  }
};


