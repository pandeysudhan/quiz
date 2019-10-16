const path = require("path");
const locatio = path.join(__dirname);
const db = require("electron-db");
var points;
db.getAll("points", locatio, (succ, data) => {
  console.log(succ);
  console.log(data);
  points = data;
  // succ - boolean, tells if the call is successful
  // data - array of objects that represents the rows.
});

document.getElementById("A").innerHTML = points[0].pts;
document.getElementById("B").innerHTML = points[1].pts;
document.getElementById("C").innerHTML = points[2].pts;
document.getElementById("D").innerHTML = points[3].pts;
document.getElementById("E").innerHTML = points[4].pts;
document.getElementById("F").innerHTML = points[5].pts;
