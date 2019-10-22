const db = require("electron-db");
const path = require("path");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
var points;
var aabbcc;
var queryString = decodeURIComponent(window.location.search);
var ready = false;

queryString = queryString.substring(1);
document.getElementById("questionNumber").innerHTML = "Set:" + queryString;

groupChoices();
function goback() {
  window.location.href = "../rapidFireRound.html";
}
function goBackWithoutAsking() {
  db.updateRow(
    "rapidFireQuestions",
    questionLocation,
    { Q: queryString },
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
  if (ready == true) {
    db.updateRow(
      "points",
      pointsLocation,
      { G: aabbcc },
      { rapidFireGroup: "done" },
      (succ, msg) => {
        console.log(succ);
        console.log(msg);

        // succ - boolean, tells if the call is successful
        // data - array of objects that represents the rows.
      }
    );
    window.location.href = "rapidFireQuestion.html?" + queryString + aabbcc;
  }
}
function groupChoices(Group) {
  document.getElementById("groupforset").style.display = "none";

  console.log(Group);
  db.getAll(
    "points",
    pointsLocation,

    (succ, data) => {
      console.log(succ);
      console.log(data);
      points = data;
      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.

      console.log(points);
    }
  );

  if (points[0].rapidFireGroup == "undone") {
    document.getElementById("A").innerHTML = points[0].GN;
    document.getElementById("A").style.display = "block";
  }
  if (points[1].rapidFireGroup == "undone") {
    document.getElementById("B").innerHTML = points[1].GN;
    document.getElementById("B").style.display = "block";
  }
  if (points[2].rapidFireGroup == "undone") {
    document.getElementById("C").innerHTML = points[2].GN;
    document.getElementById("C").style.display = "block";
  }
  if (points[3].rapidFireGroup == "undone") {
    document.getElementById("D").innerHTML = points[3].GN;
    document.getElementById("D").style.display = "block";
  }

  if (points[4].rapidFireGroup == "undone") {
    document.getElementById("E").innerHTML = points[4].GN;
    document.getElementById("E").style.display = "block";
  }
  if (points[5].rapidFireGroup == "undone") {
    document.getElementById("F").innerHTML = points[5].GN;
    document.getElementById("F").style.display = "block";
  }
}
function whichGroup(groupForSet) {
  aabbcc = groupForSet;
  ready = true;
  if (points[0].rapidFireGroup == "undone") {
    document.getElementById("A").innerHTML = points[0].GN;
    document.getElementById("A").style.display = "block";
  }
  if (points[1].rapidFireGroup == "undone") {
    document.getElementById("B").innerHTML = points[1].GN;
    document.getElementById("B").style.display = "block";
  }
  if (points[2].rapidFireGroup == "undone") {
    document.getElementById("C").innerHTML = points[2].GN;
    document.getElementById("C").style.display = "block";
  }
  if (points[3].rapidFireGroup == "undone") {
    document.getElementById("D").innerHTML = points[3].GN;
    document.getElementById("D").style.display = "block";
  }

  if (points[4].rapidFireGroup == "undone") {
    document.getElementById("E").innerHTML = points[4].GN;
    document.getElementById("E").style.display = "block";
  }
  if (points[5].rapidFireGroup == "undone") {
    document.getElementById("F").innerHTML = points[5].GN;
    document.getElementById("F").style.display = "block";
  }
  //make all undone
  db.updateRow(
    "points",
    pointsLocation,
    { G: "A" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "B" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "C" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "D" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "E" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "F" },
    { rapidFire: "undone" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );

  db.updateRow(
    "points",
    pointsLocation,
    { G: groupForSet },
    { rapidFire: "done" },
    (succ, msg) => {
      console.log(succ);
      console.log(msg);

      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  document.getElementById(groupForSet).style.display = "none";
  document.getElementById("groupforset").style.display = "block";

  document.getElementById("groupforset").innerHTML =
    points[convertGroupNameToGroupNumber(groupForSet)].GN;
}
function convertGroupNameToGroupNumber(groupNameToBeConverted) {
  if (groupNameToBeConverted == "A") {
    return 0;
  }
  if (groupNameToBeConverted == "B") {
    return 1;
  }
  if (groupNameToBeConverted == "C") {
    return 2;
  }
  if (groupNameToBeConverted == "D") {
    return 3;
  }
  if (groupNameToBeConverted == "E") {
    return 4;
  }
  if (groupNameToBeConverted == "F") {
    return 5;
  }
}
