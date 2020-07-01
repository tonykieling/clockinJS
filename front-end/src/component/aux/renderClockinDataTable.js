import * as formatDate from "./formatDate.js";

export const renderClockinDataTable = (clockin, index) => {
  const 
        ts = new Date(clockin.time_start),
        te = new Date(clockin.time_end),
        bs = clockin.break_start ? new Date(clockin.break_start) : "",
        be = clockin.break_end ? new Date(clockin.break_end) : "";
  
  const t = clockin.worked_hours 
              ? (clockin.worked_hours / 3600000)
              : (te - ts) / 3600000;
  // console.log("tttt", t);
  const clockinsToSend = {
    id          : clockin._id,
    num         : index + 1,
    date        : formatDate.show(clockin.date),
    timeStart   : (ts.getUTCHours() < 10 ? ("0" + ts.getUTCHours()) : ts.getUTCHours()) + ":" 
                  + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
    timeEnd     : (te.getUTCHours() < 10 ? ("0" + te.getUTCHours()) : te.getUTCHours()) + ":" 
                  + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
    breakStart  : bs
                    ?
                      (bs.getUTCHours() < 10 ? ("0" + bs.getUTCHours()) : bs.getUTCHours()) + ":" 
                        + (bs.getUTCMinutes() < 10 ? ("0" + bs.getUTCMinutes()) : bs.getUTCMinutes())
                    : "",
    breakEnd    : be
                    ?
                      (be.getUTCHours() < 10 ? ("0" + be.getUTCHours()) : be.getUTCHours()) + ":" 
                        + (be.getUTCMinutes() < 10 ? ("0" + be.getUTCMinutes()) : be.getUTCMinutes())
                    : "",
    rate        : clockin.rate,
    // totalTime   : ((te - ts) / ( 60 * 60 * 1000)).toFixed(2),
    totalTime   : t.toFixed(2),
    // totalCad    : (((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate))).toFixed(2),
    totalCad    : (t * (Number(clockin.rate))).toFixed(2),
    invoice     : clockin.invoice_id ? clockin.invoice.code : "not yet",
    client      : clockin.client_nickname || clockin.client_name,
    // workedHours : (clockin.worked_hours ? (clockin.worked_hours / (1000 * 60 * 60)).toFixed(2) : ""),
    workedHours : (clockin.worked_hours ? t.toFixed(2) : ""),
    notes       : clockin.notes || " "
  };
// console.log("clockinsToSend", clockinsToSend)
  return clockinsToSend;
}
