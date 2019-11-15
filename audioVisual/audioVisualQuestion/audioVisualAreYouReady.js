const db = require("electron-db");
const path = require("path");
const { shell } = require("electron");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
var mediaSeen;
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
CheckMediaSeenOrNot();
document.getElementById("questionNumber").innerHTML = "Q.N." + queryString;

function goback() {
  window.location.href = "../audioVisual.html";
}

function CheckMediaSeenOrNot() {
  db.getRows(
    "audioVisualQuestion",
    questionLocation,
    { QN: queryString },

    (succ, result) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + result);
      console.log(result[0]);
      mediaSeen = result[0].mediaSeen;
      console.log(mediaSeen);
    }
  );
}
function goBackWithoutAsking() {
  db.updateRow(
    "audioVisualQuestion",
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
  if (mediaSeen == true) {
    window.location.href = "audioVisualQuestion.html?" + queryString;
  }
}
function openFile() {
  // mediaSeen is made true so question is unlocked
  db.updateRow(
    "audioVisualQuestion",
    questionLocation,
    { QN: queryString },
    { mediaSeen: true },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );

  window.location.href = "media.html?" + queryString;
  console.log("dsfadsf");
}
