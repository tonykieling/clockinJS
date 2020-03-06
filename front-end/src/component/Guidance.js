import React from 'react'
import Card      from 'react-bootstrap/Card';
import { Link} from "react-router-dom";
import ContactFoot  from "../component/ContactFoot.js";

import SignUpPicture    from "../img/signUp.png";
import NewClientPicture from "../img/newClient.png";
import PunchInPicture   from "../img/punchIn.png";
import ListOfPunchIns   from "../img/listOfPunchIns.png";
import ClockinInfo      from "../img/clockinInfo.png";
import InvoiceGen       from "../img/invoiceGen.png";
import InvoiceP         from "../img/invoice01.png";
import InvoiceChange    from "../img/invoiceChange.png";


export default function Guidance() {
  const imgWidth = window.innerWidth;


  return (
    // <div style={{all: "unset"}} className="page-general">
    <div style={{all: "unset"}} className="formPosition">

      {/* <Card style={{backgroundColor: "aliceblue"}}> */}
      <Card className="bigCardPosition" >
        <Card.Header style={{textAlign: "center"}}>
          <h1>Quick Guidance</h1>
        </Card.Header>
        <Card.Body>
          <Card.Title >
            With Clockin.js you are able to manage your clients data, work hours and invoices.
          </Card.Title>

          <br />
            You can access the functions described below on the menu bar (computer) or menu icon on top right side (mobile).

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              1- Sign Up
            </Card.Header>
            <Card.Body>
              Here you enter you info
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              If you set a real email you are going to receive emails when you punch in and set more security to your account - change data and password only occurs by receiving a code in your email.
            </Card.Body>
          <div>
            <img src={SignUpPicture} alt="Clockin.js"
              width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
              style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
            />
          </div>
          <br />
          </Card>

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              2- Input your Clients' data
            </Card.Header>
            <Card.Body>
              The system also allows you to have client's contact info stored.
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              You can have one or multiples clients. (none also but it would not be the point :D)
            </Card.Body>
            <div>
              <img src={NewClientPicture} alt="Clockin.js" 
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
          </Card>

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              3- PunchIn
            </Card.Header>
            <Card.Body>
              Each time you work to a client you register the time about it - punch in.
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              For every Punch in, Clockin.js will send you an email with all info you registered. It is a way to double register.
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              You can also delete punchins.
            </Card.Body>
            <div>
              <img src={PunchInPicture} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
            <div>
              <img src={ListOfPunchIns} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
            <div>
              <img src={ClockinInfo} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
          </Card>

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              4- Generate invoices
            </Card.Header>
            <Card.Body>
              At the end of a period we need to invoice a client.
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              For that, you go to Invoices menu, select the client, specify the period, set a code for the invoice and generate it.
            </Card.Body>
            <br />
            <div>
              <img src={InvoiceGen} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
            <Card.Body style={{paddingTop: "0px"}}>
              Afterwars, you can check the invoice and its clockins.
            </Card.Body>
            <div>
              <img src={InvoiceP} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
            <Card.Body style={{paddingTop: "0px"}}>
              Also, you can delete the invoice and manage their status wich are: 
            </Card.Body>

            <Card.Body style={{paddingTop: "0px", paddingLeft: "2rem"}}>
              <b>1) Generated</b>, after steps above,
            </Card.Body>
            <Card.Body style={{paddingTop: "0px", paddingLeft: "2rem"}}>
              <b>2) Delivered</b>, when you handle the invoice to your client, and
            </Card.Body>
            <Card.Body style={{paddingTop: "0px", paddingLeft: "2rem"}}>
              <b>3) Received</b>, when you get the earning$ in your pockets.
            </Card.Body>
            <div>
              <img src={InvoiceChange} alt="Clockin.js"
                width={imgWidth < 800 ? (imgWidth * 0.65) : (imgWidth * 0.3)}
                style={{marginLeft: imgWidth < 800 ? ((imgWidth * 0.25) / 2) : "8rem"}}
              />
            </div>
            <br />
          </Card>

          <Card.Body style={{marginTop: "1rem"}}>
            It is easy and helpful.
          </Card.Body>

          <Card.Body style={{paddingTop: "0px"}}>
            Let's get started!
          </Card.Body>

          <Card.Body style={{paddingTop: "0px"}}>
            More info, motivation and tech topics at <Link to="/about">About</Link> or <Link to="/contact">Contact</Link>
          </Card.Body>

          <Card.Body style={{paddingTop: "0px", paddingBottom: "0px"}}>
            Kind regards from
          </Card.Body>                                    

          <Card.Body style={{paddingTop: "0px", paddingLeft: "2rem", fontWeight: "bold"}}>
            Clockin.js Team :)
          </Card.Body>

        </Card.Body>
        <br />
      </Card>

      <ContactFoot
        bckColor = {window.innerWidth < 800 ? "aliceblue" : "gainsboro"} 
        opac="iconSettingsOpacity"
      />

    </div>
  )
}
