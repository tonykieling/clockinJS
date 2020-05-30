import React from 'react'
import Card from 'react-bootstrap/Card';
import ContactFoot  from "../component/ContactFoot.js";


const ml = window.innerWidth < 800 ? "2rem" : "3rem";

export default function Guidance() {
  return (
    <div>

      {/* <Card style={{backgroundColor: "aliceblue"}}> */}
      <Card className="bigCardPosition" >
        <Card.Header style={{textAlign: "center"}}>
          <h1>About Page</h1>
        </Card.Header>

        <Card.Body>
          <br />
          <p><b>Clockin.js</b> allows you to have all your clients data, their clockins and invoices, in one place. It is easy to manage and track your work with them.</p>
          <p>The system is aimed to be responsive, providing a good visualization in both small (mobile devices) and big screens (regular computers).</p>
          <p>It also carries out some safety features, such as password encryption and Two-factor authentication for some of its procedures. Plus, some operations send email, which warranties a safe copy of them, just in case. </p>
          <p>The project and its source code is kept at <a href="https://github.com/tonykieling/clockinJS" target="_blank" rel="noopener noreferrer">GitHub - Clockin.js</a></p>

          <h2 className="contents" style={{ fontWeight: "bold"}}>
          Contents
          </h2>
          <div style={{marginLeft: ml}}>
            <a href="#id1" style={{paddingTop: "1.5rem"}}><h5>1- Functionalities</h5></a>
            <a href="#id2" style={{paddingTop: "0.9rem"}}><h5>2- System main actors</h5></a>
            <a href="#id3" style={{paddingTop: "0.9rem"}}><h5>3- Motivation</h5></a>
            <a href="#id4" style={{paddingTop: "0.9rem"}}><h5>4- Tech Stack</h5></a>
            <a href="#id5" style={{paddingTop: "0.9rem"}} id="id1" ><h5>5- Todo list and Releases</h5></a>
          </div>
        </Card.Body>

        {/* <Card style={{marginTop: "1rem"}}> */}
        <Card className="cardsPresentationPosition" >
          <Card.Header style={{textAlign: "center"}}>
            <h4>1- Some of its Funcionalities</h4>
          </Card.Header>
          <Card.Body>
            <ul>
              <li>
                User´s register
              </li> 
              <li>
                User´s login
              </li>
              <li>
                User modify their own data - 2FA already added and working
              </li>
              <li>
                Users are able to:
              </li>
              <ul>
                <li>
                  Register clients,
                </li>
                <li>
                  List, Check, and Modify client´s data,
                </li>
                <li>
                  Punch in their work hours (clock-ins),
                </li>
                <li>
                  List, Check and Edit clock-ins data,
                </li>
                <li>
                  Generate invoice and manage their status (generated, delivered and received),
                </li>
                <li>
                  List and Check invoices.
                </li>
                <div id="id2"></div>
              </ul>
            </ul>
          </Card.Body>
        </Card>

        <Card className="cardsPresentationPosition" >
          <Card.Header style={{textAlign: "center"}}>
            <h4>2- System main actors</h4>
          </Card.Header>
          <Card.Body>
            <ol>
              <li>
                <span className="strong">User: </span>
                  People who have clients and want to register their worked hours.
              </li>
              <li>
                <span className="strong">Client: </span>
                  People or organizations which the users provide their service.
              </li>
              <li>
                <span className="strong">Clock-in: </span>
                  It is the start and end time in which the users worked for a client.
              </li>
              <li>
                <span className="strong">Invoice: </span>
                  It is a set of one or more clock-ins for a particular client and period that a user wants to generate. It will contain information about the user, the client, the description of hours worked, and the total amount of money earned for the user regarding that specific client. The invoice can be generated according to the user's necessity (weekly, monthly, etc).
                  The invoice format is complained to the Government of Canada.
                  <div id="id3"></div>
              </li >
            </ol>
          </Card.Body>
        </Card>

        <Card className="cardsPresentationPosition" >
          <Card.Header style={{textAlign: "center"}}>
            <h4>3- Motivation</h4>
          </Card.Header>
          <Card.Body>
            <p>
              I have been developing the Clockin.js application to help my wife to register data and control their worked hours for her behavior intervention clients. The system facilitates the administration of the data (hours, invoice, clients) of her clients and allows a fast and reliable emission of a monthly invoice addressed to the Autism BC.
            </p>
            <p>
              The system will be used for my wife to help her to control her work hours plus will automate the invoice´s generation. However, this is not necessary or asked for her clients or any governmental agency of any country. It is for her own control, but it can be used for anyone. The invoices that this system will generate are complained to a public format and can be reached on the internet.
            </p>
            <p>
              In a general view, the system has two process: Punch-in and Invoice's generation. The first one independ to the second. It means it can be used without generate invoices, only to registering the puch-ins. The second on (invoice's process) depend on the clock-ins recorded in the system.
            </p>
            <div id="id4"></div>
          </Card.Body>
        </Card>

        <Card className="cardsPresentationPosition" >
          <Card.Header style={{textAlign: "center"}}>
            <h4>4- Tech Stack</h4>
          </Card.Header>
          <Card.Body>
            <p>
              MERN - MongoDB, Express, React and Node, plus Redux, JWT, Bootstrap, Bcrypt, Axios, Mongoose and Nodemailer are the main technologies used.
            </p>
            <div id="id5"></div>


          </Card.Body>
        </Card>

        <Card className="cardsPresentationPosition" >
          <Card.Header style={{fontSize: "h4", textAlign: "center"}}>
            <h4>5- Todo list</h4>
          </Card.Header>
          <Card.Body>
            <p>The system is in production and being used by my wife to manage her work time to her clients and me for the same reason.</p>
            <br />
            <p>Even though it is running, some improvements and features are being developed.</p>
            <ul>
              <li>Better styling for some components - almost done</li>
              <li>Edit and Delete Clockin - done</li>
              <li>Edit and Delete Invoice - done</li>
              <li>Img at Land and Quick Guidance - done</li>
              <li>Add break to clockin - done</li>
              <li>Add Guidance - done</li>
              <li>Set date to the invoice's change processes (delivered and received) - done</li>
              <li>Ordinary Clients (no kids) - Add and Edit</li>
              <li>Reports</li>
              <li>Generate a Invoice's pdf file from the system for both kids and ordinary clients.</li>
            </ul>
          </Card.Body>
        </Card>
        <br />
      </Card>

      <ContactFoot
        bckColor = {window.innerWidth < 800 ? "aliceblue" : "gainsboro"} 
        opac="iconSettingsOpacity"
      />

    </div>
  )
}
