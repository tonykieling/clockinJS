import React, {useState} from "react";

export default function PunchInTableEdit(props) {

  const [returnTable, setReturnTable] = useState("")

  const editClockin = () => {
  }
  
  const renderDataTable = () => {
    const clockins    = props.clockins;
    const thinScreen  = props.thinScreen;

    const temp = clockins.map((clockin, index) => {
      const ts = new Date(clockin.time_start);
      const te = new Date(clockin.time_end);

      const clockinsToSend = {
        id          : clockin._id,
        num         : index + 1,
        // date        : formatDate.show(clockin.date),
        date        : "",
        timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
        timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
        rate        : clockin.rate,
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)).toFixed(2),
        totalCad    : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)).toFixed(2),
        invoice     : clockin.invoice_id ? clockin.invoice.code : "not yet"
      };

      if (thinScreen) {   // small devices
        return (
          <tr key={clockinsToSend.num} onClick={() => editClockin(clockinsToSend)}>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          </tr>
        );

      } else {
        return (
          <tr key={clockinsToSend.num} onClick={() => editClockin(clockinsToSend)}>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          </tr>
        );
      }
    });
    setReturnTable(temp);
  }

  renderDataTable();

  return (
    <div>
      {returnTable}
    </div>
  )
}
