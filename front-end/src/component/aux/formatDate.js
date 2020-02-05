
/**
 * 
 * It shows a date in a string format
 * It receives a date
 * It returns a date in a string format such as Feb, 05, 2019
 * 
 */
const show = incomingDate => {
    const date = new Date(incomingDate);

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