/**
 * 
 * In this application date and time is going to be sent to the server as the UTC format
 *  there, it will be recorded as UTC
 * When the application receives from database a date or time, it will be converted to UTC, no current location.
 * 
 * Summarize:
 *  Date and time is going to be the same either front, back or server.
 * 
 */


/**
 * Convert date received as UTC to show UTC - not localtime
 * it receives a string Date
 *    "2019-01-01T00:00:00.000Z"
 * 
 * it returns a Date Object, in a UTC format, which show the expected date
 *    2019-01-01T00:00:00.000PST"
 */
const receivingDate = dateString => {
  const date = new Date(dateString.substring(0, 10));
const month = date.getUTCMonth() + 1;
const newD = (
  (date.getUTCFullYear()) + "-" + 
  (month < 10 ? `0${month}` : month) + "-" + 
  (date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()));
  // return (new Date((date.getUTCMonth() + 1) + "-" + date.getUTCDate() + "-" + date.getUTCFullYear()));   /desired format
  return newD;
}


// const transformToHr = (ts, te) => {
  
//   ts = new Date(ts);
//   te = new Date(te);
  // const fst   = parseInt((te - ts) / ( 60 * 60 * 1000));
  // const sec   = (((te - ts) / ( 60 * 60 * 1000)) - fst) % 60;
  // console.log(((te - ts) / ( 60 * 60 * 1000)))
  // console.log(((te - ts) / ( 60 * 60 * 1000)) - fst) % 60;
  // return(`${fst}:${sec}hr`);
// }

export {
  receivingDate,
  // transformToHr
};
// export default transformToHr;


// console.log(transformToHr("2019-11-07T22:00:47.000Z", "2019-11-07T23:10:47.000Z"));