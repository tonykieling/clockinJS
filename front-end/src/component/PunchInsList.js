import React, { Component } from "react";
import { connect } from "react-redux";
import Card   from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form   from "react-bootstrap/Form";
import Row    from "react-bootstrap/Row";
import Col    from "react-bootstrap/Col";
import Table  from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { getClockins } from "./aux/getClockins.js";
import GetClients from "./aux/GetClients.js";
import PunchInModal from "./PunchInModal.js";

import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";


const thinScreen = window.innerWidth < 800 ? true : false;

class PunchInsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dateStart         : "",
      dateEnd           : "",
      clientId          : "",
      clockinList       : [],
      clockInListTable  : "",
      tableVisibility   : false,
      message           : "",
      classNameMessage  : "",
      client            : {},
      cleanButton       : false,

      showModal         : false,
      clockinToModal    : {},
      // company           : "",

      disableButton     : false
    };
}


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd, 
      clientId  = this.state.clientId;

    if (clientId) {
      const a = new Date(dateStart).getTime();
      const b = new Date(dateEnd).getTime();

      if (a > b)
        this.setState({
          message   : "Check your dates",
          classNameMessage  : "messageFailure"
        });
      else {
        this.setState({
          disableButton: true
        });

        try {
          // const pastClockins  = this.state.company
          //   ? await getClockins(this.props.storeToken, "toCompany", dateStart, dateEnd, this.state.company._id)
          //   : await getClockins(this.props.storeToken, "normal", dateStart, dateEnd, clientId)
          const pastClockins = await getClockins(this.props.storeToken, "normal", dateStart, dateEnd, clientId);

          if (!pastClockins || pastClockins.error)
            // throw((!pastClockins && "No invoices at all.") || pastClockins.error);
            throw((!pastClockins && "No clockins at all.") || pastClockins.error);

          this.setState({
            clockinList       : pastClockins,
            clockInListTable  : this.renderDataTable(pastClockins),
            tableVisibility   : true,
            cleanButton       : true,
            message           : ""
          });

        } catch(err) {
          this.setState({
            message           : err || "No invoices at all.",
            classNameMessage  : "messageFailure",
            tableVisibility   : false
          });
        }

        this.setState({
          disableButton: false
        });
      }
    } else
      this.messageValidationMethod();
  }


  editClockin = data => {
    this.setState({
      showModal       : true,
      clockinToModal  : data
    });
  }


  closeClockinModal = () => {
    this.setState({
      showModal: false
    });
  }


  renderDataTable = (clockins) => {
    let
      totalTime = 0,
      totalCad  = 0;

    const firstResult = clockins.map((clockin, index) => {
      const clockinsToSend = renderClockinDataTable(clockin, index);
      totalTime += Number(clockinsToSend.totalTime);
      totalCad  += Number(clockinsToSend.totalCad);
      if (thinScreen) {   // small devices
        return (
          // this.state.company
          // ?
          //   <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.client}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          //   </tr>
          // :
            <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
            </tr>
        );

      } else {
        return (
          // this.state.company
          // ?
          //   <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.client}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
          //     <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          //   </tr>
          // :
            <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
              <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
            </tr>
        );
      }
    });

    const addTotals = (
      <tr key={firstResult.length + 1}>
        {thinScreen
          ?
            <React.Fragment>
              <td></td>
              <td style={{verticalAlign: "middle"}}><b>Total of</b></td>
              <td 
                colSpan="3" 
                style={{verticalAlign: "middle"}}
              >
                <b>{totalTime.toFixed(2)} {totalTime > 1 ? "worked hours" : "worked hour"}</b>
              </td>
            </React.Fragment>
          :
            <React.Fragment>
              <td></td>
              {/* <td colSpan={this.state.company ? 3 : 2} style={{verticalAlign: "middle"}}><b>Total of</b></td> */}
              <td colSpan={ 2 } style={{verticalAlign: "middle"}}><b>Total of</b></td>
              <td 
                style={{verticalAlign: "middle"}}
              >
                <b>{totalTime.toFixed(2)} {totalTime > 1 ? "worked hours" : "worked hour"}</b>
              </td>
              <td style={{verticalAlign: "middle"}}><b>${totalCad.toFixed(2)}</b></td>
              <td></td>
            </React.Fragment>
        }
      </tr>
    );
    const result = [...firstResult, addTotals];
    return result;
  }  


  clearForm = () => {
    this.setState({
      date            : "",
      timeStart       : "",
      timeEnd         : "",
      rate            : "",
      clientId        : "",
      message         : "",
      client          : {},
      tableVisibility : false,
      cleanButton     : false
    });
  }


  messageValidationMethod = () => {
    this.setState({
      message           : "Please, select client.",
      classNameMessage  : "messageFailure"
    });
  }


  getClientInfo = client => {
    this.setState({
      // company         : !!client.isCompany && client,
      // client          : !client.isCompany && client,
      client,
      clientId        : client._id,
      tableVisibility : false,
      message         : ""
    });
  }


  updateClockins = (clockinToRemove) => {
    const tempClockins      = this.state.clockinList.filter( clockin => clockin._id !== clockinToRemove);
    const tempClockinsTable = this.renderDataTable(tempClockins);

    this.setState({
      clockinList       : tempClockins,
      clockInListTable  : tempClockinsTable
    });
  }



  render() {
    return (
      <div className="formPosition">
        <br />

        <Card className="card-settings">
          <Card.Header>List of PunchIns</Card.Header>
          <Card.Body>
            
          { /* mount the Dropbox Button with all clients for the user */ }
          <div className="gridClientBtContainer">
            <GetClients
              client        = { this.state.client }
              getClientInfo = { this.getClientInfo }
            />

          </div>


            <br></br>
            <Form >

              <Form.Group as={Row} controlId="formST">
                <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
                <Col sm="5">
                  <Form.Control
                    type        = "date"
                    name        = "dateStart"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateStart}
                    disabled    = {( this.state.clientId === "" ) ? true : false } />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formET">
                <Col sm="3">
                  <Form.Label className="cardLabel">Date End:</Form.Label>
                </Col>
                <Col sm="5">
                  <Form.Control                
                    type        = "date"
                    name        = "dateEnd"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateEnd}
                    disabled    = {( this.state.clientId === "" ) ? true : false } />
                </Col>
              </Form.Group>

              <Card.Footer className= { this.state.classNameMessage}>          
                { this.state.message
                  ? this.state.message
                  : <br /> }
              </Card.Footer>
              <br />

              <div className="d-flex flex-column">
                { this.state.cleanButton
                  ? 
                    <ButtonGroup className="mt-3">
                      <Button 
                        variant   ="primary" 
                        onClick   = { this.handleSubmit } 
                        disabled  = { this.state.disableButton }
                      >
                        Get List
                      </Button>
                      <Button 
                        variant="info" 
                        onClick = { this.clearForm }
                      >
                        Clean
                      </Button>
                    </ButtonGroup>
                  :
                    <Button 
                      variant   = "primary" 
                      onClick   = { this.handleSubmit } 
                      disabled  = { this.state.disableButton }
                    >
                      Get List
                    </Button>
                }
              </div>
            </Form>
          </Card.Body>
        </Card>


        { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofClockins card">
              <Card.Header style={{textAlign: "center"}}>
                {/* Client: <b>{ this.state.company.name || this.state.client.nickname || this.state.client.name}</b>, {" "} */}
                Client: <b>{ this.state.client.nickname || this.state.client.name}</b>, {" "}
                <b>{this.state.clockinList.length}</b> {this.state.clockinList.length > 1 ? "Clockins" : "Clockin"}
              </Card.Header>

              {(this.state.clockinList.length > 0)
                ? thinScreen 
                  ? 
                    // this.state.company
                    // ?
                    //   <Table striped bordered hover size="sm" responsive>
                    //     <thead style={{textAlign: "center"}}>
                    //       <tr>
                    //         <th style={{verticalAlign: "middle"}}>#</th>
                    //         <th style={{verticalAlign: "middle"}}>Date</th>
                    //         <th style={{verticalAlign: "middle"}}>Kid</th>
                    //         <th style={{verticalAlign: "middle"}}>Duration</th>
                    //         {/* <th style={{verticalAlign: "middle"}}>CAD$</th> */}
                    //         <th style={{verticalAlign: "middle"}}>Invoice</th>
                    //       </tr>
                    //     </thead>
                    //     <tbody style={{textAlign: "center"}}>
                    //       {this.state.clockInListTable}
                    //     </tbody>
                    //   </Table>
                    // :
                      <Table striped bordered hover size="sm" responsive>
                        <thead style={{textAlign: "center"}}>
                          <tr>
                            <th style={{verticalAlign: "middle"}}>#</th>
                            <th style={{verticalAlign: "middle"}}>Date</th>
                            <th style={{verticalAlign: "middle"}}>At</th>
                            <th style={{verticalAlign: "middle"}}>Span</th>
                            {/* <th style={{verticalAlign: "middle"}}>CAD$</th> */}
                            <th style={{verticalAlign: "middle"}}>Invoice</th>
                          </tr>
                        </thead>
                        <tbody style={{textAlign: "center"}}>
                          {this.state.clockInListTable}
                        </tbody>
                      </Table>
                  // : this.state.company
                  //   ?
                  //     <Table striped bordered hover size="sm" responsive>
                  //       <thead style={{textAlign: "center"}}>
                  //         <tr>
                  //           <th style={{verticalAlign: "middle"}}>#</th>
                  //           <th style={{verticalAlign: "middle"}}>Date</th>
                  //           <th style={{verticalAlign: "middle"}}>Kid</th>
                  //           <th style={{verticalAlign: "middle"}}>Time Start</th>
                  //           <th style={{verticalAlign: "middle"}}>Total Time</th>
                  //           <th style={{verticalAlign: "middle"}}>CAD$</th>
                  //           <th style={{verticalAlign: "middle"}}>Invoice</th>
                  //         </tr>
                  //       </thead>
                  //       <tbody style={{textAlign: "center"}}>
                  //         {this.state.clockInListTable}
                  //       </tbody>
                  //     </Table>
                    :
                      <Table striped bordered hover size="sm" responsive>
                        <thead style={{textAlign: "center"}}>
                          <tr>
                            <th style={{verticalAlign: "middle"}}>#</th>
                            <th style={{verticalAlign: "middle"}}>Date</th>
                            <th style={{verticalAlign: "middle"}}>Time Start</th>
                            <th style={{verticalAlign: "middle"}}>Total Time</th>
                            <th style={{verticalAlign: "middle"}}>CAD$</th>
                            <th style={{verticalAlign: "middle"}}>Invoice</th>
                          </tr>
                        </thead>
                        <tbody style={{textAlign: "center"}}>
                          {this.state.clockInListTable}
                        </tbody>
                      </Table> 
                : null }
            </Card>
          : null }

        {this.state.showModal &&
          <PunchInModal 
            showModal     = { this.state.showModal}
            clockinData   = { this.state.clockinToModal}
            // client        = { this.state.company ? this.state.clockinToModal.client : this.state.client.nickname || this.state.client.name }
            client        = { this.state.client.nickname || this.state.client.name }
            deleteClockin = { (clockinId) => this.updateClockins(clockinId)}
            closeModal    = { this.closeClockinModal}
            thinScreen    = { thinScreen}
          />}

        </div>

    );
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInsList);
