import React from 'react'

import Logo from "../img/clockinjs.png";
import { Link } from "react-router-dom";
import ContactFoot  from "../component/ContactFoot.js";

const heightDiv = window.innerHeight - 56 - 62;

export default function Land() {
  const imgWidth = window.innerWidth;

  return (
    <div>
      <div
        style = {{
          paddingTop: "30px",
          height: heightDiv
        }}
      >
        <div style={{
            marginLeft: imgWidth < 800 ? "2rem" : "4rem"
          }}
        >
          <h5>
            It is easy to track your worked hours and manage invoices with Clockin.js.
          </h5>
          <br />
          <p>You just need to Sign Up and enjoy it.</p>
          <p> It is free. ;)</p>
        </div>
        <br />

        <div>
          <img src={Logo} alt="Clockin.js" 
            width={imgWidth < 800 ? imgWidth - (imgWidth * 0.08) : imgWidth - (imgWidth * 0.6)}
            style={{marginLeft: imgWidth < 800 ? ((imgWidth - (imgWidth * 0.92)) / 2) : ((imgWidth - (imgWidth * 0.4)) / 2)}}
          />
        </div>

        <div style={{marginTop: "2.5rem", textAlign:"center"}}>
          More information at
        </div>
        <div style={{textAlign:"center"}}>
          <Link to="/about">About</Link>, <Link to="/guidance">Guidance</Link> or <Link to="/contact">Contact</Link>.
        </div>
        
      </div>

      {window.innerWidth < 800
        &&
          <ContactFoot
            bckColor  = "gainsboro" 
            opac      = "iconSettingsOpacity"
          />
      }

    </div>
  )
}
