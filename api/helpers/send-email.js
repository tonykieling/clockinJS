require('dotenv').config();
const formatDT = require("./formatDT.js");

const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY, 
  domain: process.env.DOMAIN });
////////////////// need to install mailgun-js library
// const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

const sendClockinEmail = (subject, clockin, user, client) => {

  const content = (`
    <div>
      <p>Hi <b>${user.name}</b></p>
      <p>You have just punched in the following data:</p>
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
    </div>
  `);

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
      console.log("*** Mailgun: ", body.message);
  });

}


const sendResetPassword = (subject, user, code) => {

  const content = (`
    <div>
      <p>Hi <b>${user.name}</b></p>
      <p>Recently you asked to reset your password.</p>
      <p>Click on <a href="https://clockinjs.herokuapp.com/reset_password/${code}">reset password</a> to proceed.</p>
      <br>
      <p>Please, disregard this message in case you do not intend to change your password.</p>
      <br>
      <p>Kind regards from</p>
      <h4>Clockin.js Team :)</h4>
    </div>
  `);

  const data = {
    from  : "Clockin JS<clockin.js@gmail.com>",
    to    : user.email,
    subject,
    html  : content
  };
  
  mailgun.messages().send(data, (error, body) => {
    if (error)
      console.log("*** Mailgun ERROR: ", error);
    else
      console.log("*** Mailgun: ", body.message);
  });

}


module.exports = {
  sendClockinEmail,
  sendResetPassword
};
