const express     = require("express");
const PORT        = process.env.PORT || 3333;
const path        = require('path');
const app         = express();
// const morgan      = require("morgan");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
require('dotenv').config();

const userRoutes      = require("./api/routes/user.js");
const clientRoutes    = require("./api/routes/client.js");
const clockinRoutes   = require("./api/routes/clockin.js");
const invoiceRoutes   = require("./api/routes/invoice.js");
const reportRoutes    = require("./api/routes/reports.js");


// this is a middleware to log but now it is disabled
// app.use((req, res, next) => {
//   const logHandling = require("./api/helpers/log_handling.js");
//   logHandling(req.header('x-forwarded-for') || req.connection.remoteAddress || req.ip || req.connection.remoteAddress);
//   next();
// });

const cors = require('cors');
app.use(cors());

// need it to deply purposes
app.use(express.static('public'));


// console.log("+++process.env.DB", process.env.DB, process.env.JWT_KEY, process.env.JWT_expiration);
// connection to the database regarding the environment variable URI
// mongoose.connect(process.env.URI_DB, { 
try {
  mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,
    useUnifiedTopology: true });
} catch (err) {
  console.log("error on MongoDB connection");
  console.log(err.message);
}


// it logs the actions on the screen
// app.use(morgan("dev"));



// settings related to boy-parser, which allows extended urlencoder and enables to receive json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// here, it checks JSON malformatted messages
app.use((err, req, res, next) => {
  if (err) {
    return res.status(409).json({
      error: err.message
    });
  }
  else
    next()
});


// settings related to CORS
// it allows other clients (other than the SPA provided for this app) access these APIs
app.use((req, res, next) => {
// console.log(" checking headers")  
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
// console.log(" logging OPTIONS");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


// it calls user routes - there the HTTP verb is gonna be checked and proceed accordingly
app.use("/user", userRoutes);


// it calls client routes
app.use("/client", clientRoutes);


// it calls clockin routes
app.use("/clockin", clockinRoutes);


// it calls invoice routes
app.use("/invoice", invoiceRoutes);


// it calls report routes
app.use("/report", reportRoutes);


app.get('/ping', (req, res) => {
  console.log(` => ${new Date().toLocaleString('en-GB', {timeZone: "America/Vancouver"})} - PING/PONG`);
  return res.send('pong');
})

// the two below functions are designed to handle error
// the first one will be called only if the server could not handle the request by /products. /orders or /user middlewares
// the second one is just to practice how to call a next function
//   p.s. when dealing error message, it has to have 4 parameters (error, req, res, next)
// app.use((req, res) => {
//   console.log(" == no route has been found");
//   res.status(400).send("Route NOT found!!");
// });



// pass these routes to your front end
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, './public', 'index.html'))
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

