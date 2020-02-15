import React from 'react'

import Logo from "../img/clockinjs.png";
import { Link } from "react-router-dom";

export default function Land() {
  const imgWidth = window.innerWidth;
  return (
    <div>
      <br />
      <div style={{marginLeft: imgWidth < 800 ? "2rem" : "4rem"}}>
        <h5>
          It is easy to track your worked hours and manage invoices with Clockin.js.
        </h5>
        <p>You just need to Sign Up and enjoy.</p>
        <p> It is free. ;)</p>
      </div>
      <br />

      <div>
        <img src={Logo} alt="Clockin.js" 
          width={imgWidth < 800 ? imgWidth - (imgWidth * 0.08) : imgWidth - (imgWidth * 0.3)}
          style={{marginLeft: imgWidth < 800 ? ((imgWidth - (imgWidth * 0.92)) / 2) : ((imgWidth - (imgWidth * 0.7)) / 2)}}
        />
      </div>

      <div style={{marginTop: "2.5rem", textAlign:"center"}}>
        More information at
      </div>
      <div style={{textAlign:"center"}}>
        <Link to="/about">About Clockin.js</Link> or <Link to="/guidance">Guidance</Link>.
      </div>
      <br /><br />

    </div>
  )
}
