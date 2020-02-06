import React from 'react'

import Logo from "../img/clockinjs.png";
import { Link } from "react-router-dom";

export default function Land() {
  console.log("window.width", window.innerWidth);
  const imgWidth = window.innerWidth;
  return (
    // <div className="twoThirds">
    <div className="formPosition">
      <br />
      <h5>
        It is easy to track your worked times and manage invoices with Clockin.js.
      </h5>
      <p>You just need to Sign Up and enjoy.</p>
      <p> It is free. ;)</p>
      <br />
      <img src={Logo} alt="Clockin.js" width={imgWidth < 800 ? imgWidth - (imgWidth * 0.08) : imgWidth - (imgWidth * 0.2)}/>

      <div style={{marginTop: "2.5rem", textAlign:"center"}}>
        More information at
      </div>
      <div style={{textAlign:"center"}}>
        <Link to="/about">About Clockin.js</Link> or <Link to="/guidance">Guidance</Link>.
      </div>

    </div>
  )
}
