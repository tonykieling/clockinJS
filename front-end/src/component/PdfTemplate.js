import React, { Component } from 'react'
import { Button } from "react-bootstrap";
import "../PdfTemplate.css";

// export default function PdfTemplate(props) {
export default class PdfTemplate extends Component {
  // const x = `{&nbsp;&nbsp;}`;

  generatePdf = () => {
console.log("inside generatePdf");
  }


  contentBody = 
    <div>
      <div className="page">
        <div className="header">
          <h1>
            INVOICE
          </h1>
          <div className="box">
            Invoice Date
          </div>
          <div className="box">
            Invoice Number
          </div>
        </div>

        <h4 className="wholeLine">
          Service Provider Name: {this.props.client}
        </h4>

        <h4 className="wholeLine">
          Mailing Addres:
        </h4>

        <h4 className="wholeLine">
          City:
        </h4>

        <h4 className="wholeLine">
          Postal Code:
        </h4>
        
        <h4>
          <span className="wholeLine">
            Phone Number:&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </h4>
        

        <h4>
          If payee is different from above complete this section
        </h4>

        <h4 className="wholeLine">
          Payee Name:
        </h4>

        <h4 className="wholeLine">
          Mailing Addres:
        </h4>

        <h4 className="wholeLine">
          City:
        </h4>

        <h4 className="wholeLine">
          Postal Code:
        </h4>
        
        <h4>
          <span className="wholeLine">
            Phone Number:&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </h4>

        <h4>
          <span>
            Bill To:
          </span>

          <span>
            Autism Funding Branch
            Ministry of Children and Family Development
            PO Box 9776 STN PROV GOVT
            Victory BC V8W 9S5
          </span>
        </h4>

        <h4>
          Billing Number: &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="wholeLine">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </h4>
        <h4>
          Client Name: &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="wholeLine">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </h4>

      </div>
    </div>

  render() {
console.log("this.props", this.props);
    return(
      <div>
        <h2> Invoice's Preview</h2>
        <Button onClick={this.generatePdf}>
          Generate Pdf
        </Button>
        {this.contentBody}
        {this.props.clockinsTable}
      </div>
    )
  }
  
}
