const db = require("electron-db");
const path = require("path");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
document.getElementById("questionNumber").innerHTML = "Q.N." + queryString;
function goback() {
  window.location.href = "../homeRound/homeRound.html";
}
function goBackWithoutAsking() {
  db.updateRow(
    "quizzy",
    questionLocation,
    { QN: queryString },
    { status: "unasked" },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  goback();
}
function onready() {
  window.location.href = "../question/question.html?" + queryString;
}
