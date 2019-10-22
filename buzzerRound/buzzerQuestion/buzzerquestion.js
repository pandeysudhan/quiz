const db = require("electron-db");
const path = require("path");
const buzzerquestionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
//note queryString is the question Number
var stopRepeat = 0;
//fetch the points
var points;
//points to give if correct
var pointsToGive = "25";
var pointsToDeduct = "10";
var howManyTimesTimesUp = 0;
var groupToBuzz;
//timer value
var a = 1000;
var totalTimerValue = a;
var abcdef = a;
//timer for the typeWriter
var questionStringPosition = 0;
var finalQuestion;
var queryString;
var typingCompleted;
queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
getQuestion();
getAllPoints();
function goback() {
  window.location.href = "../buzzerRound.html";
}
//get the questions
function getQuestion() {
  db.getRows(
    "buzzerQuestion",
    buzzerquestionLocation,
    {
      Q: queryString
    },
    (succ, result) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log(result[0]);

      //question is in the first place of data and other are the non useful information from database
      question = result[0];
      finalQuestion = "Q.N. " + queryString + ": " + question.question;
      console.log(finalQuestion);
    }
  );
  //write the question in typewriter effect
  typeWriter();
}
function typeWriter() {
  var txt = finalQuestion;
  var speed = 50;
  if (questionStringPosition < txt.length) {
    document.getElementById("question").innerHTML += finalQuestion.charAt(
      questionStringPosition
    );
    questionStringPosition++;
    setTimeout(typeWriter, speed);
  }

  if (questionStringPosition == txt.length) {
    typingCompleted = true;
    console.log(typingCompleted);
    timer();
  }
}
async function timer() {
  timerpp = document.getElementById("progressFront");

  var timerAmountInPercent;
  if (totalTimerValue == 0) {
    timerpp.style.width = "100%";

    timerpp.style.background = "#eb4c34";
  }
  if (totalTimerValue < 0) {
    displayWhetherCorrectOrWrong("Times Up!");
    await sleep(1100);
    audience();
    await sleep(900);
    document.getElementById("conditionOfQuestion").style.display = "none";
  }

  setTimeout(function() {
    timer();
  }, 20);

  timerAmountInPercent = (totalTimerValue / abcdef) * 100;

  if (totalTimerValue < 1000) {
    document.getElementById("timeRemaining").innerHTML =
      parseInt(totalTimerValue.toString().substring(0, 1)) + 1;
  }
  if (totalTimerValue < 100) {
    document.getElementById("timeRemaining").innerHTML = "1";
  }
  if (totalTimerValue > 1000) {
    document.getElementById("timeRemaining").innerHTML =
      parseInt(totalTimerValue.toString().substring(0, 2)) + 1;
  }
  if (totalTimerValue < 0) {
    timerpp.style.width = "100%";
    timerpp.style.background = "#fc3a07";
  }

  if (timerAmountInPercent <= 100 && timerAmountInPercent > 90) {
    timerpp.style.background = "#5FA803";
  }
  if (timerAmountInPercent <= 90 && timerAmountInPercent > 80) {
    timerpp.style.background = "#A3C600";
  }
  if (timerAmountInPercent < 80 && timerAmountInPercent > 70) {
    timerpp.style.background = "#C4D20B";
  }
  if (timerAmountInPercent <= 70 && timerAmountInPercent > 60) {
    timerpp.style.background = "#D8DC01";
  }
  if (timerAmountInPercent <= 60 && timerAmountInPercent > 50) {
    timerpp.style.background = "#F3E500";
  }
  if (timerAmountInPercent <= 50 && timerAmountInPercent > 40) {
    timerpp.style.background = "#FEC307";
  }

  if (timerAmountInPercent <= 40 && timerAmountInPercent > 30) {
    timerpp.style.background = "#FAB100";
  }
  if (timerAmountInPercent <= 30 && timerAmountInPercent > 20) {
    timerpp.style.background = "#F8920C";
  }
  if (timerAmountInPercent <= 20 && timerAmountInPercent > 10) {
    timerpp.style.background = "#FC5B01";
  }
  if (timerAmountInPercent <= 10 && timerAmountInPercent > 0) {
    timerpp.style.background = "#FC3A07";
  }
  //value of timer for spontaneous flow
  var vlu = timerAmountInPercent / 10;
  //didnot knew what to name
  var iiiiii;
  for (iiiiii = 10; iiiiii > 9; iiiiii = iiiiii - 1) {
    var a = vlu * iiiiii;
    timerpp.style.width = a.toString() + "%";
    await sleep(100);
  }
  totalTimerValue = totalTimerValue - 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function displayWhetherCorrectOrWrong(status) {
  var conditionOfQuestion = document.getElementById("conditionOfQuestion");
  conditionOfQuestion.innerHTML = status;

  if (status == "Sorry! You're Incorrect.") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-danger";
    conditionOfQuestion.innerHTML = status + "<br /> Score :-10";
  }

  if (status == "Pass") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-secondary";
  }
  if (status == "Times Up!") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-danger";
  }
  await sleep(2000);
  conditionOfQuestion.style.display = "none";
}
function audience() {
  window.location.href = "buzzeraudience.html?" + queryString;
}

function whichGroup(Group) {
  document.getElementById("correct").style.display = "block";
  document.getElementById("Wrong").style.display = "block";
  document.getElementById("GroupName").style.display = "block";
  db.getRows(
    "points",
    pointsLocation,
    {
      G: Group
    },
    (succ, data) => {
      console.log(succ);
      console.log(data);
      group = data[0].GN;
      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );
  document.getElementById("GroupName").innerHTML = "Group:  " + group;

  groupToBuzz = Group;
}
function correct() {
  if (stopRepeat == 0) {
    stopRepeat = 1;
    db.updateRow(
      "points",
      pointsLocation,
      { G: groupToBuzz },
      {
        pts:
          parseInt(points[convertGroupNameToGroupNumber(groupToBuzz)].pts) +
          parseInt(pointsToGive)
      },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
    window.location.href = "correctBuzz.html?" + groupToBuzz + queryString;
  }
}
function wrong() {
  if (stopRepeat == 0) {
    document.getElementById("correct").style.display = "none";
    document.getElementById("Wrong").style.display = "none";
    document.getElementById("GroupName").style.display = "none";
    displayWhetherCorrectOrWrong("Sorry! You're Incorrect.");

    db.updateRow(
      "points",
      pointsLocation,
      { G: groupToBuzz },
      {
        pts:
          points[convertGroupNameToGroupNumber(groupToBuzz)].pts -
          parseInt(pointsToDeduct)
      },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );
  }
}

function getAllPoints() {
  db.getAll("points", pointsLocation, (succ, data) => {
    console.log(succ);
    console.log(data);
    console.log(data);

    points = data;
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  });
  document.getElementById("A").innerHTML = points[0].GN;
  document.getElementById("B").innerHTML = points[1].GN;
  document.getElementById("C").innerHTML = points[2].GN;
  document.getElementById("D").innerHTML = points[3].GN;
  document.getElementById("E").innerHTML = points[4].GN;
  document.getElementById("F").innerHTML = points[5].GN;
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
