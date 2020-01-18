require('dotenv').config();
const formatDT = require("./formatDT.js");

const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY, 
  domain: process.env.DOMAIN });
////////////////// need to install mailgun-js library
// const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

const send = (subject, clockin, user, client) => {

  const content = (`<div>
    <p>Hi <b>${user.name}</b></p>
    <p>You have just punched with the following data:</p>
    <br>
    <p> <b>Client: <i>${client.nickname} </i></b></p>
    <p> <b>Date: <i>${formatDT.showDate(clockin.date)} </i></b></p>
    <p> <b>Time start: <i>${formatDT.showTime(clockin.time_start)} </i></b></p>
    <p> <b>Time end: <i>${formatDT.showTime(clockin.time_end)} </i></b></p>
    <p> <b>Rate: <i>${clockin.rate} </i></b></p>
    <p> <b>Notes: <i>${clockin.notes} </i></b></p>
    <br><br>
    <p>Kind regards from</p>
    <h4>Clockin.js Team :)</h4>
  </div>`);

  const data = {
    from  : "Clockin JS<clockin.js@gmail.com>",
    to    : user.email,
    subject,
    // text: JSON.stringify(message)
    html  : content
  };
  
  mailgun.messages().send(data, (error, body) => {
    if (error)
      console.log("*** Mailgun ERROR: ", error);
    else
      console.log("mailgun", body.message);
  });

}


module.exports = {
  send
};

// {
//   "_id":"5e17dced93bcda3a7d4f66e8",
//   "date":"2020-01-14T00:00:00.000Z",
//   "time_start":"2020-01-14T11:11:00.000Z",
//   "time_end":"2020-01-14T22:22:00.000Z",
//   "rate":888888,
//   "notes":"",
//   "client_id":"5dd5d30ced6ae65bb4c46450",
//   "user_id":"5dced4115690ac236c4fc2c6",
//   "invoice_id":null,"__v":0}


/**
 * message to be sent:
 * 
 * Hi <user>
 * You have just punched with the following data:
 * Client: <client.nickname>
 * Date: <clockin.date>
 * Time start: <clockin.ts>
 * Time end: <clockin.te>
 * Total hour: <>
 * Rate: <clockin.rate>
 * Notes: <clockin.notes>
 * 
 * Regards from
 * Clockin.js team
 */