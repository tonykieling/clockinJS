
const transformToHr = (ts, te) => {

  ts = new Date(ts);
  te = new Date(te);
  const fst   = parseInt((te - ts) / ( 60 * 60 * 1000));
  // const sec   = (((te - ts) / ( 60 * 60 * 1000)) - fst) % 60;
  // console.log(((te - ts) / ( 60 * 60 * 1000)))
  console.log(((te - ts) / ( 60 * 60 * 1000)) - fst) % 60;
  // return(`${fst}:${sec}hr`);
}

// export default transformToHr;

console.log(transformToHr("2019-11-07T22:00:47.000Z", "2019-11-07T23:10:47.000Z"));