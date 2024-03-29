import React from 'react'

import Card      from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Col       from "react-bootstrap/Col";
import Row       from "react-bootstrap/Row";

import tkLogo from "../icons/tk.png";
import gmailIcon from "../icons/gmail.svg";
import resumeIcon from "../icons/resume.svg";
import linkedinIcon from "../icons/linkedin.png";
import githubIcon from "../icons/github.png";

export default function ContactFoot(props) {
// function ContactFoot(props, ref) {
  // const contactFootRef = useRef();

  // useEffect(() => {
  //   if (contactFootRef)
  //     console.log("***fooTTT", contactFootRef.current.offsetHeight);
  // }, [contactFootRef]);

  return (
    // <div style={{all: "unset"}}>
    <React.Fragment>
    
      <Card
        style={{
          backgroundColor : props.bckColor,
          position        :"sticky",
          bottom          : 0
        }}
        
        // ref = { contactFootRef}
      >
          <Card.Body
            style = {{
              paddingTop: "15px",
              paddingBottom: "15px"
            }}
          >
            <Container >
              <Row 
                className="justify-content-md-center"
                style = {{textAlign: "center"}}
              >
                <Col 
                  style={{textAlign: "center", padding: "0 5px"}}
                  xs sm="1"
                >
                  <a href="https://tkwebdev.ca" target="_blank" rel="noreferrer">
                    <img src={tkLogo} alt="website" title="Tony Kieling's Website" className= {props.opac || "iconSettings"} />
                  </a>
                </Col>

                <Col 
                  style={{textAlign: "center", padding: "0 5px"}}
                  xs sm="1"
                >
                  <a href="mailto:tony.kieling@gmail.com" target="_blank" rel="noreferrer">
                    <img src={gmailIcon} alt="gmail" title="Gmail" className= {props.opac || "iconSettings"} />
                  </a>
                </Col>
                
                <Col 
                  style={{textAlign: "center", padding: "0 5px"}}
                  xs sm="1"
                >
                  <a href="https://www.linkedin.com/in/tony-kieling/" target="_blank" rel="noopener noreferrer">
                    <img src={linkedinIcon} title="LinkedIn" className= {props.opac || "iconSettings"} alt="linkedin" />
                  </a>
                </Col>

                <Col 
                  style={{textAlign: "center", padding: "0 5px"}}
                  xs sm="1"
                >
                  <a href="https://github.com/tonykieling" target="_blank" rel="noopener noreferrer">
                    <img src={githubIcon} title="GitHub" className= {props.opac || "iconSettings"} alt="github"/>
                  </a>
                </Col>

                <Col 
                  style={{textAlign: "center", padding: "0 5px"}}
                  xs sm="1"
                >
                  <a href="https://resume.creddle.io/resume/hqaeq2fbnr6" target="_blank" rel="noopener noreferrer">
                    <img src={resumeIcon} title="Resume" alt="resume" className= {props.opac || "iconSettings"} />
                  </a>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
    {/* </div> */}
    </React.Fragment>

  )
}

// const forwardContactFoot = forwardRef(ContactFoot);
// export default forwardContactFoot;