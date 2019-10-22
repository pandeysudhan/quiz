const db = require("electron-db");
const path = require("path");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
var a = 1000;
var totalTimerValue = a;
var abcdef = a;
var timesIsDone = false;
//points is all the contents of points.json
var points;
var typingCompleted = false;
var que;
//all the question
var question;
var questionOfRapidFire = [];
var questionStringPosition = 0;

//how many questions asked
var howManyQuestionAsked = 0;
//setNumber means question number
var queryString = decodeURIComponent(window.location.search);
console.log("queryString:" + queryString);

setNumber = queryString.substring(1, 2);
//which rapid group
var whichRapidGroup = queryString.substring(2, 3);
console.log("======");
console.log("group for rapid round : " + whichRapidGroup);

console.log("======");

console.log("********");
console.log("set number:" + setNumber);
var whichQuestion = 0;
timer();
getQuestion();
function goback() {
  window.location.href = "../rapidFireRound.html";
}
function getQuestion() {
  //show the group
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

  document.getElementById("groupforset").innerHTML =
    points[convertGroupNameToGroupNumber(whichRapidGroup)].GN;

  db.getRows(
    "rapidFireQuestions",
    questionLocation,
    {
      Q: setNumber
    },
    (succ, result) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);

      //question is in the first place of data and other are the non useful information from database
      question = result[0];

      questionOfRapidFire[0] = question.Q1;
      questionOfRapidFire[1] = question.Q2;
      questionOfRapidFire[2] = question.Q3;
      questionOfRapidFire[3] = question.Q4;
      questionOfRapidFire[4] = question.Q5;
      questionOfRapidFire[5] = question.Q6;
      questionOfRapidFire[6] = question.Q7;
      questionOfRapidFire[7] = question.Q8;
      questionOfRapidFire[8] = question.Q9;
      questionOfRapidFire[9] = question.Q10;
    }
  );
  que = "Q.N.1 " + questionOfRapidFire[0];
  //write the question in typewriter effect
  typeWriter();
}

function typeWriter() {
  console.log("question no:" + whichQuestion.toString());
  console.log(que);

  var leng = que.length;
  console.log("[[[[[[");
  console.log(leng);
  console.log(questionStringPosition);
  console.log(typingCompleted);

  console.log("]]]]]]");

  var speed = 50;
  if (questionStringPosition < leng) {
    document.getElementById(
      "Q" + whichQuestion.toString()
    ).innerHTML += que.charAt(questionStringPosition);
    questionStringPosition++;
    setTimeout(typeWriter, speed);
  }
  if (questionStringPosition == leng) {
    typingCompleted = true;
    console.log(typingCompleted);
  }
}
function correct() {
  if (timesIsDone == false) {
    if (typingCompleted == true) {
      // howManyQuestionAsked == 9 because counting starts from 0

      if (howManyQuestionAsked <= 9) {
        howManyQuestionAsked = howManyQuestionAsked + 1;
        document.getElementById("correctno").innerHTML = (
          parseInt(document.getElementById("correctno").innerHTML) + 1
        ).toString();
        typingCompleted = false;
        whichQuestion = whichQuestion + 1;

        que =
          "Q.N." +
          (whichQuestion + 1).toString() +
          questionOfRapidFire[whichQuestion];
        questionStringPosition = 0;
        if (howManyQuestionAsked <= 9) {
          typeWriter();
        }
      }
      if (howManyQuestionAsked == 10) {
        document.getElementById("done").style.display = "block";
      }
    }
    document.getElementById("pointsGot").style.display = "block";
    document.getElementById("pointsGot").innerHTML =
      "Total Points: +" +
      parseInt(document.getElementById("correctno").innerHTML) * 10;
  }
}
function wrong() {
  if (typingCompleted == true) {
    // howManyQuestionAsked == 9 because counting starts from 0

    if (howManyQuestionAsked <= 9) {
      howManyQuestionAsked = howManyQuestionAsked + 1;
      document.getElementById("wrongno").innerHTML = (
        parseInt(document.getElementById("wrongno").innerHTML) + 1
      ).toString();
      typingCompleted = false;
      whichQuestion = whichQuestion + 1;

      que = questionOfRapidFire[whichQuestion];
      questionStringPosition = 0;
      if (howManyQuestionAsked <= 9) {
        typeWriter();
      }
    }
    if (howManyQuestionAsked == 10) {
      document.getElementById("done").style.display = "block";
    }
  }
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
function done() {
  db.updateRow(
    "points",
    pointsLocation,
    { G: whichRapidGroup },
    {
      pts:
        parseInt(points[convertGroupNameToGroupNumber(whichRapidGroup)].pts) +
        parseInt(document.getElementById("correctno").innerHTML) * 10
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  goback();
}
async function timer() {
  timerpp = document.getElementById("progressFront");

  var timerAmountInPercent;
  if (totalTimerValue == 0) {
    timerpp.style.width = "100%";

    timerpp.style.background = "#eb4c34";
  }

  setTimeout(function() {
    timer();
  }, 10);

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
    document.getElementById("done").style.display = "block";
    timesIsDone = true;
    timerpp.style.width = "100%";
    timerpp.style.background = "#fc3a07";
    document.getElementById("timeRemaining").innerHTML = "Time's Up!";
    document.getElementById("timeRemaining").style.width = "auto";
    document.getElementById("timeRemaining").style.marginLeft = "30%";
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
