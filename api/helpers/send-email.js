const formatDT = require("./formatDT.js");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.password
  }
});


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
          ${formatDT.showDate(clockin.date)}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Time Start</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${formatDT.showTime(clockin.time_start)}
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Time End</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${formatDT.showTime(clockin.time_end)}
        </td>
      </tr>
      ${clockin.break_start 
        ?
          `<tr>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              <b>Break Start</b>
            </td>
            <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
              ${formatDT.showTime(clockin.break_start)}
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
              ${formatDT.showTime(clockin.break_end)}
            </td>
          </tr>`
        : ""}
      <tr>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          <b>Worked Hours</b>
        </td>
        <td style="border: 1px solid black; padding: 0.2rem 0.6rem">
          ${formatDT.showTime(clockin.worked_hours)}
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


const sendResetPassword = async (subject, user, code) => {

  const content = (`
    <div>
      <p>Hi <b>${user.name.split(" ")[0]}</b></p>
      <p>Recently you asked to reset your password.</p>
      <p>Click on <a href="https://clockinjs.herokuapp.com/reset_password/${code}">reset password</a> to proceed.</p>
      <br>
      <p>Please, disregard this message in case you do not intend to change your password.</p>
      <br>
      <p>Kind regards from</p>
      <h4>Clockin.js Team :)</h4>
    </div>
  `);

  await generalSender(user.email, subject, content);
}


/**
 * this method is called when a new user is signed up
 * it is used to advise and let me knwo so I can add the nes user as mailgun authorized recipient
 * the caller method need to pass only the new user object
 *  */
const gotNewUser = async (user) => {
  const content = (`
    <div>
      <p>New user</p>
      <p><b>${user}</b></p>
      <br>
      <p>Kind regards from</p>
      <h4><a href="https://clockinjs.herokuapp.com">Clockin.js</a> Team :)</h4>
    </div>
  `);

  await generalSender("tony.kieling@gmail.com", "!!!!! Clockin.js got a new user", content);
}


/**
 * it send a welcome message to the new user
 */
const welcomeEmail = async (user, to) => {
  const content = (`
    <div>
      <p>Hi ${user.split(" ")[0]}.</p>
      <p>Welcome to <a href="https://clockinjs.herokuapp.com">Clockin.js</a></p>
      <br>
      <p>Feel free to use the system, register your clients, punch your worked times and generated invoices.<p>
      <br>
      
      <p>Kind regards from</p>
      <h4><a href="https://clockinjs.herokuapp.com">Clockin.js</a> Team :)</h4>
    </div>
  `);

  await generalSender(to, "Welcome - Clockin.js", content);
};



const generalSender = async (to, subject, html) => {
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


module.exports = {
  sendClockinEmail,
  sendResetPassword,
  gotNewUser,
  welcomeEmail
};
