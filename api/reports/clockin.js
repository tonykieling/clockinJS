"use strict";

const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
const Client    = require("../models/client.js");
// const user = require("../models/user.js");

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
// console.trace("======> req.body", req.body)
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
  let result = {};
  if (all) {
    // calls the function for all clients
    const summary = await queryClockins(userId, dateStart, dateEnd)
    const clients = await allClients(userId);
    const arrayOfClockinsByClient = await clients.map(async e => 
      await queryClockins(userId, dateStart, dateEnd, e._id, (e.nickname || e.name))  
    );
    const clockinsByClient = await Promise.all(arrayOfClockinsByClient);

    result = {
      summary,
      clockinsByClient
    };

  } else {
    // calls the function for a specific client
    const summary = await queryClockins(userId, dateStart, dateEnd, clientId);
    result.summary = summary;
  }

  result = {
    ...result,
    period: {
      dateStart,
      dateEnd
    }
  };

  return res.json(result);

}


//it gets info about the clients
const allClients = async(userId) => {
  try {
    // checks client info
    const clients = await Client
      .find({
        user_id: userId
      });

    return(clients);
  } catch (error) {
    console.log("Error: Clockin Report - 03 ");
    return ({
      error: "Error: Clockin Report - 03 "
    });
  }
}



//it queries the dbs the clockins for either a user or a client
const queryClockins = async (userId, dateStart, dateEnd, clientId, clientName) => {
  const conditions = {
    user_id: mongoose.Types.ObjectId(userId),
    date: {
      $gte: dateStart,
      $lte: dateEnd
    }
  }
  // how to ignore (not consider) a field in find mongodb
  if (clientId) conditions.client_id = mongoose.Types.ObjectId(clientId);


  let allClockins = "";
  try {
    allClockins = await Clockin
      .find(conditions)
      .sort({date: 1})

  } catch (error) {
    console.log("Error: Clockin Report - 04 ");
    return ({
      error: "Error: Clockin Report - 04 "
    });
  }



  let client = "";
  if (!clientName && clientId) {
    try {
      // checks client info
      client = await Client
        .findById( clientId );

    } catch (error) {
      console.log("Error: Clockin Report - 05 ");
      return ({
        error: "Error: Clockin Report - 05 "
      });
    }
  }

  if (!allClockins || allClockins.length < 1)
    return ({
      message: `No clockins at all.`,
      client: client ? client.nickname || client.name : clientName
    });


  const totalHours = (allClockins.reduce((a, b) => {
    return b.worked_hours 
      ? (a + b.worked_hours) 
      : (a + (new Date(b.time_end) - new Date(b.time_start)))
  }, 0)) / 3600000;

  const invoicedClockins = allClockins.filter(e => e.invoice_id);

  const totalClockinsInvoiced = invoicedClockins.length;
  const totalHoursInvoiced    = (invoicedClockins.reduce((a, b) => 
      b.worked_hours
        ? (a + b.worked_hours)
        : (a + (new Date(b.time_end) - new Date(b.time_start))), 0) / 3600000);

  const totalClockinsNoInvoice  = allClockins.length - totalClockinsInvoiced;
  const totalHoursNoInvoice     = totalHours - totalHoursInvoiced;

  const result = {
    totalClockins : allClockins.length,
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


module.exports = {
  general
};
