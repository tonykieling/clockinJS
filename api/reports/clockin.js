"use strict";

const mongoose  = require("mongoose");

const Clockin   = require("../models/clockin.js");
const Client    = require("../models/client.js");

// mongoose.set("debug", true);

// main function for clockin's report
const general = async(req, res) => {
  if (!req.userData) {
    console.log("Error - Clockin Report - 01");
    return res.json({error: "Error: Clockin Report 01"});
  }
  const userId    = req.userData.userId;

  const 
    clientId        = req.query.clientId,
    dateStart       = new Date(req.query.dateStart),
    dateEnd         = new Date(req.query.dateEnd),
    checkAllClients = req.query.checkAllClients;

  if ((!clientId && !checkAllClients) || !dateStart || !dateEnd) {
    console.log("Error - Clockin Report - 02");
    return res.json({error: "Error: Clockin Report 02"});
  }

  let result = {};
  if (checkAllClients === "true") {
    // calls the function that proceed for all clients
    const summary = await queryClockins(userId, dateStart, dateEnd);
    const clients = await allClients(userId);
    const arrayOfClockinsByClient = await clients.map(e => 
      e.isCompany
        ? 
          {
            client: e.nickname || e.name,
            message: "It is a company",
            isComapny: true
          }
        : queryClockins(userId, dateStart, dateEnd, e._id, (e.nickname || e.name))  
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



//it queries the dbs the clockins for either a user (all clients) or a client
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
        error: "Error: Clockin Report - 05 "
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


module.exports = {
  general
};
