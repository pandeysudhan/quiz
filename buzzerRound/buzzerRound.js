const path = require("path");
const ipc = require("electron").ipcRenderer;
const pointsLocation = path.join(__dirname, "../points/");
const db = require("electron-db");
var points;
const buzzerquestionLocation = path.join(__dirname, "/buzzerQuestion/");
const electron = require("electron");
const BrowserWindow = electron.remote.BrowserWindow;
let win;
var datas;
setQuestionChoices();
function setQuestionChoices() {
  db.getAll("buzzerQuestion", buzzerquestionLocation, (succ, data) => {
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
    questionNumber[i] = datas[i - 1].Q;
    addQN = "Q.";
    question[i].innerHTML = addQN + questionNumber[i];
    question[i].id = "QN" + i;
    //to match the class name from internet
    question[i].className = "questionChoice btn btn-primary";
    if (datas[i - 1].status == "asked") {
      question[i].disabled = true;
      question[i].style.opacity = 0;
    }

    question[i].onclick = function() {
      //gets the value of button and return only number
      queNo = this.innerHTML.replace(addQN, "");
      db.updateRow(
        "buzzerQuestion",
        buzzerquestionLocation,
        {
          Q: queNo
        },
        {
          status: "asked"
        },
        (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        }
      );

      document.getElementById(this.id).style.opacity = 0;

      console.log(queNo);

      QN(this.id.replace("QN", ""));
    };

    document.getElementById("questionChoicesArea").appendChild(question[i]);
  }
}

function resetQuestions() {
  for (i = 1; i <= datas.length; i++) {
    console.log("---------");
    console.log(i.toString());

    console.log("---------");

    db.updateRow(
      "buzzerQuestion",
      buzzerquestionLocation,
      {
        Q: i.toString()
      },
      {
        status: "unasked"
      },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
    document.getElementById("QN" + i).style.opacity = 1;
    document.getElementById("QN" + i).disabled = false;
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
  win.loadFile("points/editPoints/editPoints.html");
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
  //set the names of groups
  document.getElementById("AH").innerHTML = points[0].GN;
  document.getElementById("BH").innerHTML = points[1].GN;
  document.getElementById("CH").innerHTML = points[2].GN;
  document.getElementById("DH").innerHTML = points[3].GN;
  document.getElementById("EH").innerHTML = points[4].GN;
  document.getElementById("FH").innerHTML = points[5].GN;
}

function QN(id) {
  window.location.href = "buzzerQuestion/buzzerQuestion.html?" + id;
}

function reset() {
  for (var i = 0; i <= 5; i++) {
    db.updateRow(
      "points",
      pointsLocation,
      {
        forReset: i
      },
      {
        pts: 0
      },
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
    {
      name: "G"
    },
    {
      whichGroupToChooseQuestions: "A"
    },
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
    {
      G: "A"
    },
    {
      pts: args.A
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    {
      G: "B"
    },
    {
      pts: args.B
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    {
      G: "C"
    },
    {
      pts: args.C
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );

  db.updateRow(
    "points",
    pointsLocation,
    {
      G: "D"
    },
    {
      pts: args.D
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    {
      G: "E"
    },
    {
      pts: args.E
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  db.updateRow(
    "points",
    pointsLocation,
    {
      G: "F"
    },
    {
      pts: args.F
    },
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

function backToMain() {
  window.location.href = "../mainPage/mainPage.html";
}
function rules() {
  window.location.href = "rules.html";
}
