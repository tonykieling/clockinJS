import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import Card       from "react-bootstrap/Card";
import Form       from "react-bootstrap/Form";
import Button     from "react-bootstrap/Button";
import Row        from "react-bootstrap/Row";
import Col        from "react-bootstrap/Col";
import Container  from "react-bootstrap/Container";
import { Link} from "react-router-dom";
import { getClockins } from "./aux/getClockins.js";
// import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";

// import moment from "moment";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";


class PunchInNew extends Component {

  state = {
    date          : "",
    startingTime  : "",
    endingTime    : "",
    rate          : "",
    notes         : "",
    message       : "",
    client        : {},
    addBreak      : false,
    startingBreak : "",
    endingBreak   : "",
    validBreak    : true,
    classNameMessage  : "",
    disabledBtn   : false,

    showPastClockins  : false,
    pastClockins      : "",
    tablePastClockins : "",
    messageNoClockins : "No clockins for this day"
  };


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });

    // event.target.name === "date" && this.getPastClockins(event.target.value);
  }


  // it checks past clockins as soon the user selected a date
  getPastClockins = async () => {
    // console.log("date====>", date.targe.name)
    console.log("inside get past clockins, calling getClockins, date=>", this.state.client._id)

    //should query clockins
    const pastClockins = await getClockins(this.props.storeToken, "byDate", this.state.date, this.state.client._id);
    console.log("pastClockins: ", pastClockins)
    this.setState({
      showPastClockins  : true,
      pastClockins,
      tablePastClockins : pastClockins && "table is coming soon"
    });
  }


  handleSubmit = async event => {
    this.setState({ disabledBtn: true });
    event.preventDefault();

    const data = { 
      date          : this.state.date,
      timeStart     : this.state.startingTime,
      timeEnd       : this.state.endingTime,
      rate          : this.state.rate,
      notes         : this.state.notes || undefined,
      clientId      : this.state.client._id,
      startingBreak : this.state.startingBreak || undefined,
      endingBreak   : this.state.endingBreak || undefined
    };
    
    if ( !data.clientId || !data.date || !data.timeStart || !data.timeEnd || !data.rate || !this.state.validBreak)
      !this.state.validBreak ? this.checkBreakIsValid(event) : this.messageValidationMethod();
    else {
      const url = "/clockin";
      try {
        const addClockin = await axios.post( 
          url,
          data,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (addClockin.data.message) {
          this.setState({
            message          : `Punched in!`,
            classNameMessage : "messageSuccess",
            addBreak         : false
          });
        } else if (addClockin.data.error)
          this.setState({
            message          : addClockin.data.error,
            classNameMessage : "messageFailure"
          });
        
      } catch(err) {
        this.setState({
          message          : err.message,
          classNameMessage : "messageFailure"
        });
      }

      this.clearForm();
    }
  }


  messageValidationMethod = () => {
    this.setState({
      message          : (Object.entries(this.state.client).length === 0) ? "Please, select client." : "Please fill or correct the fields.",
      classNameMessage : "messageFailure"
    });

    this.clearMessage();
  }


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        disabledBtn : false
      });
      // this.headerRef.focus();
      // window.scrollTo(0,0); // goes to the top of the screen and can see the message
    }, 3000);
  }


  clearForm = () => {
    setTimeout(() => {
      this.setState({
        date          : "",
        startingTime  : "",
        endingTime    : "",
        rate          : "",
        notes         : "",
        message       : "",
        client        : {},
        disabledBtn   : false,
        startingBreak : "",
        endingBreak   : ""
      });
      window.scrollTo(0,0); // goes to the top of the screen and can see the message
    }, 3000);
  }


  showTotalTime = () => {
    const time1     = Date.parse(`01 Jan 1970 ${(this.state.startingTime)}:00 GMT`);
    const time2     = Date.parse(`01 Jan 1970 ${this.state.endingTime}:00 GMT`);
    const break1    = this.state.startingBreak ? Date.parse(`01 Jan 1970 ${this.state.startingBreak}:00 GMT`) : 0;
    const break2    = this.state.endingBreak ? Date.parse(`01 Jan 1970 ${this.state.endingBreak}:00 GMT`) : 0;
    const tb        = ((break1 && break2) && (break2 > break1)) ? break2 - break1 : 0;
    const tt        = (((time2 - time1) - tb) / (60 * 60 * 1000));
    const totalTime = parseFloat(Math.round(tt * 100) / 100).toFixed(2)
    
    return(
      <span>
        {totalTime}
      </span>
    )
  }

  getClientInfo = client => {
    this.setState({
      client  : client,
      rate    : client.default_rate
    });
  }


  handleAddBreak = () => {
    this.setState({ 
      addBreak      : !this.state.addBreak,
      startingBreak : this.state.startingBreak && "",
      endingBreak   : this.state.endingBreak && "",
      message       : this.state.message && ""
    });
  }


  checkBreakIsValid = event => {
    if (this.state.startingBreak || this.state.endingBreak) {
      if ((this.state.endingBreak <= this.state.startingBreak)
            || (this.state.startingBreak <= this.state.startingTime)
            || (event.target.name !== "startingBreak" && (this.state.endingTime <= this.state.endingBreak)))
        this.setState({ 
          message         : "Break is incorrect.",
          classNameMessage: "messageFailure",
          validBreak      : false
        });
      else
        this.setState({ 
          message     : "",
          validBreak  : true,
          disabledBtn : false
        });
        this.clearMessage();
    } else {
      this.clearMessage();
    }
  }


  checkOnFocusEndingBreak = () => {
    this.setState({ 
      message     : "",
      validBreak  : true
    });
  }


  render() {
    return (
      <div className="formPosition">
        <br />
        
        <Card className="card-settings">
          <Card.Header 
          >PunchIn</Card.Header>
          <Card.Body>
            { /* mount the Dropbox Button with all clients for the user */ }
            <div className="gridClientBtContainer">
              <GetClients 
                client        = { this.state.client }
                getClientInfo = { this.getClientInfo } />
                
            </div>
          <br></br>
          <Form onSubmit={this.handleSubmit} >

            <Form.Group as={Row} controlId="formDate">
              <Form.Label column sm="3" className="cardLabel">Worked in</Form.Label>
              <Col sm="6">
                <Form.Control 
                  type        = "date"
                  name        = "date"
                  onChange    = {this.handleChange}
                  value       = {this.state.date}
                  // onKeyPress  = {this.handleChange}
                  onBlur      = {this.getPastClockins}
                  // onSelect    = { () => console.log("DATE=", this.state.date)}
                  // onInput    = {this.getPastClockins}
                />
              </Col>
            </Form.Group>

            {this.state.showPastClockins &&
              <Card.Footer style = {{ color: "green", fontStyle: "bold"}}>          
                { this.state.pastClockins
                  ? this.state.tablePastClockins
                  : this.state.messageNoClockins }
              </Card.Footer>
            }


            <Container style={{paddingLeft: 0}}>
              <Row style={{paddingLeft: 0}}>
                <Col>
                  <Form.Label className="cardLabel" >Starting</Form.Label>
                </Col>
                <Col>
                  <Form.Label className="cardLabel" >Ending</Form.Label>
                </Col>
                <Col>
                  <Form.Label className="cardLabel" >Total</Form.Label>
                </Col>
              </Row>

              <Row style={{paddingLeft: 0}}>
                <Col>
                  <Form.Control
                    style       = {{padding: "6px 2px"}}
                    type        = "time"
                    name        = "startingTime"
                    onChange    = {this.handleChange}
                    value       = {this.state.startingTime}
                    onKeyPress  = {this.handleChange}
                    onBlur      = { this.checkBreakIsValid}
                  />
                </Col>
                <Col>
                  <Form.Control
                    style       = {{padding: "6px 2px"}}
                    type        = "time"
                    name        = "endingTime"
                    onChange    = {this.handleChange}
                    value       = {this.state.endingTime}
                    onKeyPress  = {this.handleChange}
                    onBlur      = { this.checkBreakIsValid}
                 />
                </Col>
                <Col>
                  { (this.state.endingTime && this.state.startingTime)
                        ? this.showTotalTime()
                        : null }
                </Col>
              </Row>
            </Container>

            <Link to={window.location} onClick= { this.handleAddBreak} >{this.state.addBreak ? "Remove break" : "Add Break"}</Link>


            { this.state.addBreak
              &&
                <Card className="card-settings">
                  <Container style={{paddingLeft: 0}}>
                    <Row style={{paddingLeft: 0}}>
                      <Col>
                        <Form.Label className="cardLabel" >From</Form.Label>
                      </Col>
                      <Col>
                        <Form.Label className="cardLabel" >To</Form.Label>
                      </Col>
                    </Row>

                    <Row style={{paddingLeft: 0}}>
                      <Col style={{paddingRight: 0}}>
                        <Form.Control
                          style       = {{padding: "6px 0"}}
                          type        = "time"
                          name        = "startingBreak"
                          onChange    = {this.handleChange}
                          value       = {this.state.startingBreak}
                          onKeyPress  = {this.handleChange}
                          onBlur      = { this.checkBreakIsValid}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          style       = {{padding: "6px 0"}}
                          type        = "time"
                          name        = "endingBreak"
                          onChange    = {this.handleChange}
                          value       = {this.state.endingBreak}
                          onKeyPress  = {this.handleChange}
                          onBlur      = { this.checkBreakIsValid}
                          onFocus     = { this.checkOnFocusEndingBreak}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Card>
            }
            <br />

            { this.state.client.showRate &&
              <Form.Group as={Row} controlId="formRate">
                <Form.Label column sm="3" className="cardLabel" >Rate</Form.Label>
                <Col sm="3">
                  <Form.Control
                    type        = "number"
                    placeholder = { this.state.rate || "Rate ($)"}
                    name        = "rate"
                    onChange    = {this.handleChange}
                    onKeyPress  = {this.handleChange}
                    value       = {this.state.rate}
                  />
                </Col>
              </Form.Group>
            }

            { this.state.client.showNotes &&
              <Form.Group controlId="formBasicPassword">
                <Form.Label className="cardLabel">Notes</Form.Label>
                <Form.Control
                  as          = "textarea"
                  rows        = "3"
                  placeholder = "Session's Notes"
                  name        = "notes"
                  onChange    = {this.handleChange}
                  value       = {this.state.notes}
                  onKeyPress  = {this.handleChange}
                />
              </Form.Group>
            }

            { (!this.state.client.showRate && !this.state.showNotes) && <br />}
            
            <Card.Footer className= { this.state.classNameMessage}>          
              { this.state.message
                ? this.state.message
                : <br /> }
            </Card.Footer>

            <div className="d-flex flex-column">
              <Button
                disabled  = { this.state.disabledBtn}
                variant   = "primary" 
                type      = "submit" 
                onClick   = { this.handleSubmit } >
                Submit
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>        
      <br /><br />
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInNew);
