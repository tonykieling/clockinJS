const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
const Client    = require("../models/client.js");
const user = require("../models/user.js");
const { cat } = require("shelljs");

// mongoose.set("debug", true);


const general = async(req, res) => {
  console.log("inside clockins' report - specific");
// console.log("req.body", req.body)
  // if (!req.userData) {
  //   console.log("Error - Clockin Report - 01");
  //   return res.json({error: "Error: Report 01"});
  // }
  // const userId    = req.userData.userId;
  const userId  = "5db0d13c35d7c5475beb17fd";

  const 
    clientId  = req.body.clientId,
    dateStart = new Date(req.body.dateStart),
    dateEnd   = new Date(req.body.dateEnd),
    all       = req.body.all;

  if ((!clientId && !all) || !dateStart || !dateEnd) {
    console.log("Error - Clockin Report - 02");
    return res.json({error: "Error: Report 02"});
  }

// console.log("dateEnd", dateStart)
let clockins = "";
  if (all) {
    // calls the function for all clients
    clockins = await allClients(userId, clientId, dateStart, dateEnd);
  } else {
    // calls the function for a specific client
    clockins = await specificClient(userId, clientId, dateStart, dateEnd);
    console.log("XXXXXXXXXXXXXclockins", clockins, "\n\n")
  }

  const totalHours = (clockins.allClockins.reduce((a, b) => {
    return b.worked_hours 
      ? (a + b.worked_hours) 
      : (a + (new Date(b.time_end) - new Date(b.time_start)))
  }, 0)) / 3600000;

  const invoicedClockins = clockins.allClockins.filter(e => e.invoice_id);
  console.log("invoicedClockins", invoicedClockins)

  const totalClockinsInvoiced = invoicedClockins.length;
  const totalHoursInvoiced    = (invoicedClockins.reduce((a, b) => 
      b.worked_hours
        ? (a + b.worked_hours)
        : (a + (new Date(b.time_end) - new Date(b.time_start))), 0) / 3600000);

  const totalClockinsNoInvoice  = clockins.allClockins.length - totalClockinsInvoiced;
  const totalHoursNoInvoice     = totalHours - totalHoursInvoiced;
  
  const result = all 
    ?
      {
        message: "TEMPPPPPPPPPPPPPPP"
      }
    : {
        period: {
          dateStart,
          dateEnd
        },
        totalClockins : clockins.count,
        totalClockinsInvoiced,
        totalClockinsNoInvoice,
        totalHours,
        totalHoursInvoiced,
        totalHoursNoInvoice,
        client: clockins.client
      }

  return res.json(result);

}


//comment
const specificClient = async (userId, clientId, dateStart, dateEnd) => {
  console.log("inside specific client")

  let allClockins = "";
  try { 
    allClockins = await Clockin
      .find( 
        {
          user_id: mongoose.Types.ObjectId(userId),
          date: {
            $gte: dateStart,
            $lte: dateEnd
          },
          client_id: mongoose.Types.ObjectId(clientId)
        }
      )
      .sort({date: 1});

    console.log("===> allClockins", allClockins)
  
    if (!allClockins || allClockins.length < 1) {
      return ({
        error: `No clockins at all.`
      });
    }
  } catch (error) {
    console.log("Error: Clockin Report - 03 ");
    return ({
      error: "Error: Clockin Report - 03 "
    });
  }



  let client = "";
  try {
    // checks client info
    client = await Client
      .findById( clientId )
      .select(" nickname ");
  } catch (error) {
    console.log("Error: Clockin Report - 04 ");
    return ({
      error: "Error: Clockin Report - 04 "
    });
  }

  return ({
    count: allClockins.length,
    allClockins,
    client: client.nickname || client.name
  });

}




const allClients = async(userId, dateStart, dateEnd) => {
  return({message: "TESSSSSSSSSSSSST"});
};





const all = async (req, res) => {
  console.log("inside clockins' report - specific");

  const userId    = req.userData.userId;

  const 
    clientId  = req.query.clientId,
    dateStart = new Date(req.query.dateStart || "2000-03-01T09:00:00.000Z"),
    dateEnd   = new Date(req.query.dateEnd || "2100-03-01T09:00:00.000Z");

  try { 
    let allClockins = null;
    // if (!userAdmin)
    if (userAdmin) /////////////// ----->>>>> this is the right one
      allClockins = await Clockin
        .find()
        .select(" date time_start time_end rate notes invoice_id client_id user_id ");
    else {
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
    }

    if (!allClockins || allClockins.length < 1) {
      return res.status(200).json({
        error: `No clockins at all.`
      });
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


      return res.status(200).json({
        count: allClockins.length,
        allClockins,
        client: client.nickname, 
        codeSuggestion
      });
    };

    return res.status(200).json({
      count: allClockins.length,
      allClockins
    });
  
  } catch(err) {
    console.log("Error => ", err.message);
    return res.status(422).json({
      error: "EACK02: Something's got wrong."
    });
  }
}


module.exports = {
  general
};
