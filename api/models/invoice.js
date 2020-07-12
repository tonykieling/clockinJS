// this is the definition/shape of Invoices should like in the application
const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  date: {
    type: Date,
    required: true
  },

  date_start: {
    type: Date,
    required: true
  },
  
  date_end: {
    type: Date,
    required: true
  },
  
  notes: {
    type: String
  },
  
  total_cad: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    required: true
  },
  
  code: {
    type: String,
    required: true
  },
  
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date_delivered: {
    type: Date
  },

  date_received: {
    type: Date
  },

  cad_adjustment: {
    type: Number    
  },

  reason_adjustment: {
    type: String
  },

  for_company: {
    type  : Boolean
  }

});

module.exports = mongoose.model("Invoice", invoiceSchema);
