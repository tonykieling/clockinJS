const shell = require("shelljs");

// const x = shell.exec("lsof -i :3333 | grep 3333", {silent: true}, (code, output) => {
//   // shell.echo(`exit code => ${code}`);
  
//   // shell.echo(`output => ${output}`);
//   // return output;
// }).output;
const x = shell.exec("lsof -i :3333 | grep 3333").split(" ").join("");
let portNumber = "";
for (let c = 0; c < 12; c += 1) {
  if (Number(x[c])) {
    portNumber += x[c];
  }
}
console.log(x);
// console.log("x-->", x.split(" ").join(""));
console.log(portNumber);
shell.exec(`kill -9 ${portNumber}`);