const path = require("path");
const ipc = require("electron").ipcRenderer;
const pointsLocation = path.join(__dirname, "../points/");
const db = require("electron-db");

setPoints();
function openRapidFireRound() {
  window.location.href = "../rapidFire/rapidFireRound.html";
}
function openHomeRound() {
  window.location.href = "../main/homeRound/homeRound.html";
}
function setGroup() {}
function openBuzzerRound() {
  window.location.href = "../buzzerRound/buzzerRound.html";
}
function setPoints() {
  db.getAll("points", pointsLocation, (succ, data) => {
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

  document.getElementById("AH").innerHTML = points[0].GN;
  document.getElementById("BH").innerHTML = points[1].GN;
  document.getElementById("CH").innerHTML = points[2].GN;
  document.getElementById("DH").innerHTML = points[3].GN;
  document.getElementById("EH").innerHTML = points[4].GN;
  document.getElementById("FH").innerHTML = points[5].GN;
}
function openAudioVisualRound() {
  window.location.href = "../audioVisual/audioVisual.html";
}
