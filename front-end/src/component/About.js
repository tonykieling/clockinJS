import React from 'react';
import "../About.css";

export default function Error() {
  return (
    <div className="page-general">
      <h1>About</h1>
      <div className="content-general">
        <h1 className="main-title">ClockinJS</h1>

        <p>The system is aimed to allow register clock-ins and generate invoices.</p>

        <h2 className="sub-title">Some of its functionalities are:</h2>

        <ul>
          <li>
            User´s register
          </li> 
          <li>
            User´s login
          </li>
          <li>
            User modify their own data
          </li>
          <li>
            Users are able to:
          </li>
          <li>
            Register clients,
          </li>
          <li>
            List, Check, and Modify client´s data,
          </li>
          <li>
            Punch in their hours,
          </li>
          <li>
            List, Check and Edit clock-ins data,
          </li>
          <li>
            Generate invoice and control their status (generated, sent and received),
          </li>
          <li>
            List and Check invoices.
          </li>
        </ul>


        <h2 className="sub-title">System main actors</h2>
        <ol>
          <li>
            <span className="strong">User:</span>
              People who have clients and want to register their worked hours.
          </li>
          <li>
            <span className="strong">Client:</span>
              People or organizations which the users provide their service.
          </li>
          <li>
            <span className="strong">Clock-in:</span>
              It is the start and end time in which the users worked for a client.
          </li>
          <li>
            <span className="strong">Invoice:</span>
              It is one or a set of clock-ins for a particular client that a user wants to generate. It will contain information about the user, the client, the description of hours worked, and the total amount of money accumulated for the user regarding that specific client. The invoice can be generated according to the user's necessity ( weekly, monthly).
              The invoice format is complained to the Government of Canada...
          </li>
        </ol>

        <h2 className="sub-title">Motivation</h2>
        <p>
          I developed the ClockinJS to help my wife to register data and control their worked hours for her behavior intervention clients. The system facilitates the administration of the data (hours, invoice, clients) of her clients and allows a fast and reliable emission of a monthly invoice addressed to the Autism BC.
        </p>
        <p>
          The system is being used for my wife to help her to control her work hours plus will automate the invoice´s generation. However, this is not necessary or asked for her clients or any governmental agency of any country. It is for her own control, but it can be used for anyone. The invoices that this system will generate are complained to a public format and can be reached on the internet.
        </p>
        <p>
          In a general view, the system has two process: Punch-in and Invoice's generation. The first one independ to the second. It means it can be used without generate invoices, only to registering the puch-ins. The second on (invoice's process) depend on the clock-ins recorded in the system.
        </p>

        <h2 className="sub-title">Teck stack</h2>
        <p>
          MERN - MongoDB, Express, React and Node, plus JWT, React, Bootstrap, and Bcrypt are the main technologies used.
        </p>

        <h2 className="sub-title">Todo list and Releases</h2>
        <p>The system is in production and being used by my wife to record and list their hours for her clients.</p>
        <p>Features under developing are:</p>
        <ul>
          <li>Change password (being logged)</li>
          <li>Forget password (captcha + send by email - Mailgun)</li>
          <li>Edit Clockin</li>
          <li>Generate Invoices</li>
          <li>Review invoice backend code,</li>
          <li>Generate invoice's UI,</li>
          <li>Process (control invoice's status),</li>
          <li>Adapt pdf to receive data from the system.</li>
        </ul>

        <h3 className="sub-title">Contact</h3>
          <p> Tony Kieling's: </p>
            <ul>
              <li>
                <a href="mailto:tony.kieling@gmail.com" target="_top">Gmail - tony.kieling@gmail.com</a> 
                <br />
              </li>
              <li>
                <a href="https://www.linkedin.com/in/tony-kieling/" target="_blank">LinkedIn</a>
                <br />
              </li>
              <li>
                <a href="https://github.com/tonykieling" target="_blank">GitHub</a> 
                <br />
              </li>
              <li>
                <a href="https://resume.creddle.io/resume/hqaeq2fbnr6" target="_blank">Resume</a> <br />
              </li>
                <br /><br />
            </ul>

      </div>
    </div>
  )
}
