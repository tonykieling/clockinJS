import React from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ContactFoot from "./ContactFoot.js";

function Home(props) {
  return (
    <div>
        {/* <Card className="card-settings"> */}
        <Card className="homeBack">
        <Card.Body>
          <Card.Title>Home Page</Card.Title>      
            <br />
            Hi <b>{props.storeUser}</b>
            <br /> <br />
            With Clockin.js you are able to have all your clients data, their clockins and invoices, in one system.
            It is easy to manage and track your work with them.
            <br />
            More information at <Link to="/about">About Clockin.js</Link>, <Link to="/guidance">Guidance</Link> or <Link to="/contact">Contact</Link>.
            <br /><br />
            Enjoy and good work!!
            <br /><br /><br />
            <p>Kind regards from</p>
            <b>Clockin.js Team :)</b>
          </Card.Body>
        </Card>

        <ContactFoot
          bckColor = "gainsboro" 
          opac="iconSettingsOpacity"
        />
    </div>
  )
}

const mapStateToProps = store => {
  return {
    storeUser      : store.name
  }
};


export default connect(mapStateToProps, null)(Home);