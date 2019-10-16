const path = require("path");
const ipc = require("electron").ipcRenderer;
const pointsLocation = path.join(__dirname, "../points/");
const db = require("electron-db");
var points;
const questionLocation = path.join(__dirname, "../question/");
const electron = require("electron");
const BrowserWindow = electron.remote.BrowserWindow;
let win;
var datas;

setQuestionChoices();

function setRotation() {
  if (document.getElementById("ClockWise").checked == true) {
    db.updateRow(
      "points",
      pointsLocation,
      { name: "G" },
      { rotation: "C" },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
  } else if (document.getElementById("AntiClockWise").checked == true) {
    db.updateRow(
      "points",
      pointsLocation,
      { name: "G" },
      { rotation: "A" },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
  }
}
function setQuestionChoices() {
  db.getAll("quizzy", questionLocation, (succ, data) => {
    console.log(succ);
    console.log(data);
    console.log(data);

    datas = data;

    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  });
  var question = [];
  var questionNumber = [];
  //makes question Button for each of the questions
  for (i = 1; i <= datas.length; i++) {
    question[i] = document.createElement("button");
    questionNumber[i] = datas[i - 1].QN;
    addQN = "Q.N. ";
    question[i].innerHTML = addQN + questionNumber[i];
    question[i].id = "QN" + i;
    //to match the class name from internet
    question[i].className = "hbtn questionChoice";
    if (datas[i - 1].status == "asked") {
      question[i].style.opacity = 0;
    }

    question[i].onclick = function() {
      //gets the value of button and return only number
      queNo = this.innerHTML.replace(addQN, "");
      db.updateRow(
        "quizzy",
        questionLocation,
        { QN: queNo },
        { status: "asked" },
        (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        }
      );
      document.getElementById(this.id).style.opacity = 0;
      console.log(queNo);
      setRotation();
      QN(this.id.replace("QN", ""));
    };

    document.getElementById("questionChoices").appendChild(question[i]);
  }
}
function resetQuestions() {
  for (i = 1; i <= datas.length; i++) {
    console.log("---------");
    console.log(i.toString());

    console.log("---------");

    db.updateRow(
      "quizzy",
      questionLocation,
      { QN: i.toString() },
      { status: "unasked" },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
    document.getElementById("QN" + i).style.opacity = 1;
  }
}
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    id: 86,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  });
  win.once("ready-to-show", () => {
    win.show();
  });

  // and load the index.html of the app.
  win.loadFile("main/points/editPoints/editPoints.html");
  win.webContents.openDevTools;
  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("message", points);
  });
}

setPoints();
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
  console.log(points[6].whichGroupToChooseQuestions);

  currentGroup = points[6].whichGroupToChooseQuestions;
  //highlights the group to choose question
  document.getElementById(currentGroup + "H").style.backgroundColor = "green";

  //it sets the value of rotation initially
  if (points[6].rotation == "C") {
    document.getElementById("ClockWise").checked = true;
  }
  if (points[6].rotation == "A") {
    document.getElementById("AntiClockWise").checked = true;
  }
}

function QN(id) {
  window.location.href = "../question/question.html?" + id;
}

function reset() {
  for (var i = 0; i <= 5; i++) {
    db.updateRow(
      "points",
      pointsLocation,
      { forReset: i },
      { pts: 0 },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
  }

  db.updateRow(
    "points",
    pointsLocation,
    { name: "G" },
    { whichGroupToChooseQuestions: "A" },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  currentGroup = points[6].whichGroupToChooseQuestions;
  document.getElementById(currentGroup + "H").style.backgroundColor = "";
  setPoints();
}
ipc.on("UpdateThePoints", function(event, args) {
  console.log(args);

  db.updateRow(
    "points",
    pointsLocation,
    { G: "A" },
    { pts: args.A },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "B" },
    { pts: args.B },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "C" },
    { pts: args.C },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );

  db.updateRow(
    "points",
    pointsLocation,
    { G: "D" },
    { pts: args.D },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "E" },
    { pts: args.E },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    { G: "F" },
    { pts: args.F },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  setPoints();
  document.getElementById("A").innerHTML = args.A;
  document.getElementById("B").innerHTML = args.B;
  document.getElementById("C").innerHTML = args.C;

  document.getElementById("D").innerHTML = args.D;
  document.getElementById("E").innerHTML = args.E;
  document.getElementById("F").innerHTML = args.F;
});
function next() {
  var datas;
  //get the fresh copy of points database
  db.getAll("points", pointsLocation, (succ, data) => {
    console.log(succ);
    console.log(data);
    datas = data;
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  });
  var currentGroupNumber = convertGroupNameToGroupNumber(currentGroup);
  var rotation = datas[6].rotation;
  //if rotation is clockwise
  if (rotation == "C") {
    if (currentGroupNumber == 5) {
      currentGroupNumber = 0;
    } else {
      currentGroupNumber = currentGroupNumber + 1;
    }
  }
  //if rotation is anticlockwise
  if (rotation == "A") {
    if (currentGroupNumber == 0) {
      currentGroupNumber = 5;
    } else {
      currentGroupNumber = currentGroupNumber - 1;
    }
  }
  var nextGroupToChooseQuestions = convertGroupNumberToGroupName(
    currentGroupNumber
  );
  db.updateRow(
    "points",
    pointsLocation,
    { name: "G" },
    { whichGroupToChooseQuestions: nextGroupToChooseQuestions },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  // change all table heading to original color
  document.getElementById("AH").style.backgroundColor = "beige";
  document.getElementById("BH").style.backgroundColor = "beige";
  document.getElementById("CH").style.backgroundColor = "beige";
  document.getElementById("DH").style.backgroundColor = "beige";
  document.getElementById("EH").style.backgroundColor = "beige";
  document.getElementById("FH").style.backgroundColor = "beige";

  setPoints();
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
function convertGroupNumberToGroupName(groupNumberToBeConverted) {
  if (groupNumberToBeConverted == 0) {
    return "A";
  }
  if (groupNumberToBeConverted == 1) {
    return "B";
  }
  if (groupNumberToBeConverted == 2) {
    return "C";
  }
  if (groupNumberToBeConverted == 3) {
    return "D";
  }
  if (groupNumberToBeConverted == 4) {
    return "E";
  }
  if (groupNumberToBeConverted == 5) {
    return "F";
  }
}
