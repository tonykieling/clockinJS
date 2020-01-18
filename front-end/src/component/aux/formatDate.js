const show = incomingDate => {

// console.log("INSIDE formatDate component");
    // console.log(">>>>>> incomingDate", incomingDate);
        const date = new Date(incomingDate);
    // console.log("===", date, "=", date.toUTCString());
    // the error is because month is taking the date before convert it to UTC
    // solved with the below code
    // need to create a function componenet to have this as a pattern for each date in the system, i.e. "Jan 01, 2020"
        // const month = date.toLocaleString('default', { month: 'short' });
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getUTCDate() > 9 ? date.getUTCDate() : `0${date.getUTCDate()}`;
        return(`${month[date.getUTCMonth()]} ${day}, ${date.getUTCFullYear()}`);
      }


const set = () => {
    console.log("TEST FORMATDATE");
    return;
}

export {
    show,
    set 
};