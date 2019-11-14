const shell = require("shelljs");

// const x = shell.exec("lsof -i :3333 | grep 3333", {silent: true}, (code, output) => {
//   // shell.echo(`exit code => ${code}`);
  
//   // shell.echo(`output => ${output}`);
//   // return output;
// }).output;
const x = shell.exec("lsof -i :3333 | grep -i *:3333").split(" ").join("");
// const x = shell.exec("lsof -i :3333 | grep 3333");
// console.log(`x = '${x}'`);
if (x != "") {
  let portNumber = "";
  for (let c = 0; c < 12; c += 1) {
    if (Number(x[c]) || x[c] == "0") {
      portNumber += x[c];
      // console.log("portNumber", x[c]);
    }
  }
  // console.log("x-->", x.split(" ").join(""));
  console.log(`KILLING port ${portNumber}`);
  shell.exec(`kill -9 ${portNumber}`);
} else
  console.log("nothing")