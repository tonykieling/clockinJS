const express     = require("express");
const PORT        = process.env.PORT || 3333;
const app         = express();
const morgan      = require("morgan");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
require('dotenv').config();

// const productRoutes   = require("./api/routes/products.js");
const userRoutes      = require("./api/routes/user.js");
const clientRoutes    = require("./api/routes/client.js");
const clockinRoutes   = require("./api/routes/clockin.js");
const invoiceRoutes   = require("./api/routes/invoice.js");

console.log("+++process.env.DB", process.env.DB);
// connection to the database regarding the environment variable URI
// mongoose.connect(process.env.URI_DB, { 
mongoose.connect(process.env.DB, { 
  useNewUrlParser: true,
  useUnifiedTopology: true });


// it logs the actions on the screen
app.use(morgan("dev"));



// settings related to boy-parser, which allows extended urlencoder and enables to receive json format
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// here, it checks JSON malformatted messages
app.use((err, req, res, next) => {
  if (err)
    res.status(409).json({
      error: err.message
    });
  else
    next()
})


// settings related to CORS
// it allows other clients (other than the SPA provided for this app) access these APIs
app.use((req, res, next) => {
console.log(" checking headers")  
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
console.log(" logging OPTIONS");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


// it handles the root calling
app.get("/", (req, res) => {
  res.send(`This is root "/"`);
});


// it calls user routes - there the HTTP verb is gonna be checked and proceed accordingly
app.use("/user", userRoutes);


// it calls client routes
app.use("/client", clientRoutes);


// it calls clockin routes
app.use("/clockin", clockinRoutes);


// it calls invoice routes
app.use("/invoice", invoiceRoutes);


// the two below functions are designed to handle error
// the first one will be called only if the server could not handle the request by /products. /orders or /user middlewares
// the second one is just to practice how to call a next function
//   p.s. when dealing error message, it has to have 4 parameters (error, req, res, next)
app.use((req, res) => {
  console.log(" == no route has been found");
  res.status(400).send("Route NOT found!!");
});


app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

