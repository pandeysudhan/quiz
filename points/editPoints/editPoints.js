const remote = require("electron").remote;
const ipc = require("electron").ipcRenderer;

const BrowserWindow = remote.BrowserWindow;
const db = require("electron-db");
const path = require("path");
const pointsLocation = path.join(__dirname, "../");
eee();
setPointsForEditing();
function setPointsForEditing() {
  ipc.on("message", (event, points) => {
    // logs out "Hello second window!"
    document.getElementById("A").value = points[0].pts;
    document.getElementById("B").value = points[1].pts;
    document.getElementById("C").value = points[2].pts;
    document.getElementById("D").value = points[3].pts;
    document.getElementById("E").value = points[4].pts;
    document.getElementById("F").value = points[5].pts;
  });
}
//location of the points

function cancel() {
  var thisWindow = remote.getCurrentWindow();
  thisWindow.close();
}
function updatePoints() {
  sendEditedPoints();
  close();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function sendEditedPoints() {
  var editedPoints = {
    A: document.getElementById("A").value,
    B: document.getElementById("B").value,
    C: document.getElementById("C").value,
    D: document.getElementById("D").value,
    E: document.getElementById("E").value,
    F: document.getElementById("F").value
  };
  ipc.send("UpdatedPoints", editedPoints);
}
function eee() {
  var windowObjectArray = remote.BrowserWindow.getAllWindows();
  for (var i = 0, len = windowObjectArray.length; i < len; i++) {
    var windowObject = windowObjectArray[i];
    console.log("window id: " + windowObject.id);
    console.log("name: " + windowObject._name);
    console.log("tag: " + windowObject.webContents.getTitle());
  }
}
