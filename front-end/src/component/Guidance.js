import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function Guidance() {
  return (
    <div className="page-general">

      <Card style={{backgroundColor: "aliceblue"}}>
        <Card.Header style={{textAlign: "center"}}>
          Quick Guidance
        </Card.Header>
        <Card.Body>
          <Card.Title style={{backgroundColor: ""}}>
            With Clockin.js you are able to manage data about your clients, work hours and invoices.
          </Card.Title>
            Each set of actions described below are reached by its own menu.

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              1- Sign Up
            </Card.Header>
            <Card.Body>
              Here you you enter you info
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              If you set a real email you are going to receive emails when you punch in and set more security to your account - change data and password only occurs by receiving a code in your email.
            </Card.Body>
          </Card>

          <Card style={{marginTop: "1rem"}}>
            <Card.Header style={{fontSize: "h4"}}>
              2- Input data of your Clients
            </Card.Header>
            <Card.Body>
              The system also allows you to have client's contact info stored.
            </Card.Body>
            <Card.Body style={{paddingTop: "0px"}}>
              You can have one or multiples clients. (none also but it would not be the point :D)
            </Card.Body>
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
            <Card.Body style={{paddingTop: "0px"}}>
              Afterwars, you can check the invoice and its clockins.
            </Card.Body>
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
          </Card>

          <Card.Body style={{marginTop: "1rem"}}>
            It is easy and helpful.
          </Card.Body>

          <Card.Body style={{paddingTop: "0px"}}>
            Let's get started!
          </Card.Body>

          <Card.Body style={{paddingTop: "0px"}}>
            More info, motivation and tech topics at <Link to="/about">About Clockin.js</Link>
          </Card.Body>

          <Card.Body style={{paddingTop: "0px", paddingBottom: "0px"}}>
            Kind regards from
          </Card.Body>                                    

          <Card.Body style={{paddingTop: "0px", paddingLeft: "2rem", fontWeight: "bold"}}>
            Clockin.js Team :)
          </Card.Body>

        </Card.Body>








      </Card>
    </div>
  )
}
