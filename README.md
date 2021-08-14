# **Clockin.js**
More information, please, check at https://clockin.tkwebdev.ca/about  
  
  
### **The project**
This project is aimed to have a system with users, clients, clockins and invoices. It will allow:
 - register clients
 - punch in work hours
 - generate invoices and manage them

### **Dependencies:**
  - express (for v1, running with server. The current version is a serverless function approach and do not need Express)
  - nodemon
  - body-parser
  - mongoose
  - bcrypt
  - jsonwebtoken
  - nodemailer
  - react-bootstrap
  - react-redux

  *p.s.1: the database used is MongoDB and its connections settings are based on nodemon.js file.*  
  *p.s.2: the nodemon.js file has the following variables.*  
    "URI_DB" - which is the database path with password within it  
    "JWT_KEY" - the key used by JWT  
    "JWT_expiration" - JWT expiration time  
  *p.s.3: the client side was executed using Postman.*

 ### **How to install:**  
  `# git clone https://github.com/tonykieling/shop.git .`  
  `# npm i`  
  `# npm start`    

  **How to use:**  
  Please, check at https://clockin.tkwebdev.ca/about
  
