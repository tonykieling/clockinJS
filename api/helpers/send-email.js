require('dotenv').config();

// var API_KEY = 'YOUR_API_KEY';
// var DOMAIN = 'YOUR_DOMAIN_NAME';
// var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
const mailgun = require("mailgun-js")({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});
////////////////// need to install mailgun-js library
// const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

const send = (subject, message, toEmail) => {
  const data = {
    from: "Clockin JS<clockin.js@gmail.com>",
    to: toEmail,
    subject,
    text: JSON.stringify(message)
    // check mailgun templates at: 
  };
console.log("data===>", data);
  
  mailgun.messages().send(data, (error, body) => {
    if (error)
      console.log("*** Mailgun ERROR: ", error);
    else
      console.log("body mailgun", body);
  });

}


module.exports = {
  send
};