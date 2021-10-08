import ReCaptchaV2 from "react-google-recaptcha";


export default function MyReCaptchaV2(props) {
  console.log("props:::", props);
  
  return (
    <ReCaptchaV2
    sitekey   = { process.env.REACT_APP_RECAPTCHA_SITE_KEY }
    onChange  = { this.reCaptchaChange }
    size      = "invisible"
    ref       = { input => this.refReCaptcha = input }
  />
  );
}