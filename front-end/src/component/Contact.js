import React from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// import { Link } from "react-router-dom";

import gmailIcon from "../icons/gmail.svg";
import resumeIcon from "../icons/resume.svg";
import linkedinIcon from "../icons/linkedin.png";
import githubIcon from "../icons/github.png";


export default function Contact() {
  return (
    <React.Fragment>
      <Card className="bigCardPosition" >
        <Card.Header style={{textAlign: "center"}}>
          <h1>Contact</h1>
        </Card.Header>

        <Card.Body>
          <h4 style={{marginTop: "1rem"}}>Clockin.js author is Tony Kieling.</h4>

          <br />
          <p>Curious and self-taught passionate about data handling and process automation. He has a background as an IT system analyst, which has made him an excellent problem solver, always committed to finding ways to automate solutions using the right tools and best practices. He holds experience and maturity in dealing with customers and users' demands in a complex context and he is eager to face challenges and deliver a reliable and first-class code.</p>
        </Card.Body>


        <Card className="cardsPresentationPosition" >
          <Card.Header style={{textAlign: "center"}}>
            <h4>Tony Kieling's Contacts</h4>
          </Card.Header>
          <Card.Body>

            <Container style = {{maxWidth: "250px"}}>
              <Row>
                <Col style={{textAlign: "center", padding: "0 5px"}}>
                  <a href="mailto:tony.kieling@gmail.com" target="_top" >
                    <img src={gmailIcon} alt="gmail" className="iconSettings" />
                  </a>
                </Col>
                
                <Col style={{textAlign: "center", padding: "0 5px"}}>
                  <a href="https://www.linkedin.com/in/tony-kieling/" target="_blank" rel="noopener noreferrer">
                    <img src={linkedinIcon} className="iconSettings" alt="linkedin" />
                  </a>  
                </Col>

                <Col style={{textAlign: "center", padding: "0 5px"}}>
                  <a href="https://github.com/tonykieling" target="_blank" rel="noopener noreferrer">
                    <img src={githubIcon} className="iconSettings" alt="linkedin"/>
                  </a>
                </Col>

                <Col style={{textAlign: "center", padding: "0 5px"}}>
                  <a href="https://resume.creddle.io/resume/hqaeq2fbnr6" target="_blank" rel="noopener noreferrer">
                    <img src={resumeIcon} alt="resume" className="iconSettings" />
                  </a>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <br /><br />
      </Card>
    </React.Fragment>
  )
}
