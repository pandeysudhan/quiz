const db = require("electron-db");
const path = require("path");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../points/");
var abcdef;






//for respective passes
var passTimer = [20, 15, 10, 10, 10, 10];

//how many times the question is passed
var numberOfPasses = 0;
if (numberOfPasses == 0) {
  totalTimerValue = passTimer[0];
  abcdef=totalTimerValue

}
//timer for the typeWriter
var questionStringPosition = 0;
//which group choose the question iii is the name of the group
var iii;
//no. of group staring from 0
var currentGroupNumberToGivePoints;
//current group
var currentGroupToGivePoints;
//next group after pass or wrong or correct
var nextGroupToGivePoints;
// to get the initial points of groups
var points;
//to make sure correct is not clicked multiple times
var repeated = false;
//to get the questions
var question;
//finally print the question
var finalQuestion;
//define i for the value of trpewriter position
var i;
// The speed/duration of the effect in milliseconds
var speed = 50;
//get the question number from the url
var queryString;

//rotation of the game
var rotation;

//all data of the points section
var datas;
//run the required initial function
timer();

runRequiredFunctions();

//get the questions
function getQuestion() {
  queryString = decodeURIComponent(window.location.search);
  queryString = queryString.substring(1);

  db.getRows(
    "quizzy",
    questionLocation,
    {
      QN: queryString
    },
    (succ, result) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log(result[0]);

      //question is in the first place of data and other are the non useful information from database
      question = result[0];
      finalQuestion = "Q.N. "+queryString+" "+question.question;
      console.log(finalQuestion);
    }
  );
  //write the question in typewriter effect
  typeWriter();
}
//the asnwer is correct
async function correct() {
  setNextGroupToChooseQuestion();
  settingCurrentAndNextGroup();
  console.log(currentGroupNumberToGivePoints);

  if (repeated == false) {
    //update the group points
    db.updateRow(
      "points",
      pointsLocation,
      { G: currentGroupToGivePoints },
      { pts: points[currentGroupNumberToGivePoints].pts + 1 },
      (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      }
    );

    displayWhetherCorrectOrWrong("Congratulations! You're Correct"),
      setTimeout(function() {}, 3000);
    await sleep(500);
    back();
    repeated = true;
  }
}

function setCurrentGroupToChooseQuestionsAsTheGroupToGivePoints() {
  var groupToChooseQuestion;

  db.getAll("points", pointsLocation, (succ, data) => {
    console.log(succ);
    console.log(data);
    console.log(data);

    datas = data;
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  });
  //getting who chose the question
  groupToChooseQuestion = datas[6].whichGroupToChooseQuestions;
  iii = groupToChooseQuestion;
  db.updateRow(
    "points",
    pointsLocation,
    { name: "G" },
    {
      whichGroupToGivePoints: groupToChooseQuestion
    },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
  console.log(groupToChooseQuestion);
}

function setNextGroupToChooseQuestion() {
  var i;
  var nextGroupToChooseQuestions;
  console.log(iii);

  i = convertGroupNameToGroupNumber(iii);

  //if rotation is clockwise
  if (rotation == "C") {
    if (i == 5) {
      i = 0;
    } else {
      i = i + 1;
    }
  }
  //if rotation is anticlockwise
  if (rotation == "A") {
    if (i == 0) {
      i = 5;
    } else {
      i = i - 1;
    }
  }

  nextGroupToChooseQuestions = convertGroupNumberToGroupName(i);

  console.log("========");
  console.log(i);
  console.log("========");
  //update the next group to choose questions
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
  back();
}
//to just go back
function back() {
  window.location.href = "../homeRound/homeRound.html";
  //making the question unasked on back
}
//all required function at initial
function runRequiredFunctions() {
  setCurrentGroupToChooseQuestionsAsTheGroupToGivePoints();
  getQuestion();
  getPoints();
  setRotation();
  console.log("jbjhlkj");
  console.log(points);

  setCurrentGroup();
  setCurrentGroupNumberAndNextGroup();
}

function setRotation() {
  rotation = datas[6].rotation;
}
function settingCurrentAndNextGroup() {}
//get the initial points
function getPoints() {
  db.getAll("points", pointsLocation, (succ, data) => {
    console.log(succ);
    console.log(data);
    console.log(data);

    points = data;
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  });
}
function wrong() {
  pass();
  displayWhetherCorrectOrWrong("Sorry!You're Incorrect");
}
//question is passed
function pass() {
  //remove the times up message of previous group
  document.getElementById("timeUp").innerHTML = "TIMES UP";
  numberOfPasses = numberOfPasses + 1;
  totalTimerValue = passTimer[numberOfPasses];
  abcdef=totalTimerValue

  console.log("---------");
  console.log("---------");
  console.log("---------");
console.log(abcdef);
  if (numberOfPasses <= 5) {
    //change the time for passed questions
    if (pass == 1) {
      totalTimerValue = firstpass;
    }
    setNextGroupToChooseQuestion();

    //updates next group in database
    updateNextGroupToGivePointsInDatabase();

    // to get new group information
    getPoints();

    //sets the current group as obtained from above
    setCurrentGroup();

    //sets next group as obtained information from above
    setCurrentGroupNumberAndNextGroup();
    displayWhetherCorrectOrWrong("PASSED");
  }
}

//get the current group
function setCurrentGroup() {
  currentGroupToGivePoints = points[6].whichGroupToGivePoints;
  console.log(";;;;;;;;;;");
  console.log(currentGroupToGivePoints);

  console.log(";;;;;;;;;;");
  groupToDisplay();
}
//set the current group number(0-5) and set next group
function setCurrentGroupNumberAndNextGroup() {
  //if the rotation is clockwise
  console.log("-----------");
  console.log(rotation);

  console.log("-----------");

  if (rotation == "C") {
    if (currentGroupToGivePoints == "A") {
      currentGroupNumberToGivePoints = 0;
      nextGroupToGivePoints = "B";
    } else if (currentGroupToGivePoints == "B") {
      currentGroupNumberToGivePoints = 1;
      nextGroupToGivePoints = "C";
    } else if (currentGroupToGivePoints == "C") {
      currentGroupNumberToGivePoints = 2;
      nextGroupToGivePoints = "D";
    } else if (currentGroupToGivePoints == "D") {
      currentGroupNumberToGivePoints = 3;
      nextGroupToGivePoints = "E";
    } else if (currentGroupToGivePoints == "E") {
      currentGroupNumberToGivePoints = 4;
      nextGroupToGivePoints = "F";
    } else if (currentGroupToGivePoints == "F") {
      currentGroupNumberToGivePoints = 5;
      nextGroupToGivePoints = "A";
    }
  }
  //if the rotation is anticlockwise
  if (rotation == "A") {
    if (currentGroupToGivePoints == "A") {
      currentGroupNumberToGivePoints = 0;
      nextGroupToGivePoints = "F";
    } else if (currentGroupToGivePoints == "B") {
      currentGroupNumberToGivePoints = 1;
      nextGroupToGivePoints = "A";
    } else if (currentGroupToGivePoints == "C") {
      currentGroupNumberToGivePoints = 2;
      nextGroupToGivePoints = "B";
    } else if (currentGroupToGivePoints == "D") {
      currentGroupNumberToGivePoints = 3;
      nextGroupToGivePoints = "C";
    } else if (currentGroupToGivePoints == "E") {
      currentGroupNumberToGivePoints = 4;
      nextGroupToGivePoints = "D";
    } else if (currentGroupToGivePoints == "F") {
      currentGroupNumberToGivePoints = 5;
      nextGroupToGivePoints = "E";
    }
  }

  console.log("----------");

  console.log("----------");

  updateNextGroupToGivePointsInDatabase();
}
function updateNextGroupToGivePointsInDatabase() {
  db.updateRow(
    "points",
    pointsLocation,
    { name: "G" },
    { whichGroupToGivePoints: nextGroupToGivePoints },
    (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    }
  );
}
function displayWhetherCorrectOrWrong(status) {
  document.getElementById("correctORwrong").innerHTML = status;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function typeWriter() {
  var txt = "Lorem ipsum dummy text blabla.";
  var speed = 50;
  if (questionStringPosition < txt.length) {
    document.getElementById("question").innerHTML += finalQuestion.charAt(
      questionStringPosition
    );
    questionStringPosition++;
    setTimeout(typeWriter, speed);
  }
}
// for which group is currently active
function groupToDisplay() {
  document.getElementById("GroupName").innerHTML = currentGroupToGivePoints;
}
function timer() {
var timeramount;
  if (totalTimerValue < 0) {
    
    console.log("---------");
    document.getElementById("timeUp").innerHTML = "TIMES UP";
    console.log("Times Up");
    console.log("---------");
    pass();
  }
  console.log(totalTimerValue);

  setTimeout(function() {
    timer();
  }, 1000);

  timerpp= document.getElementById("progressFront")
  console.log(abcdef);
  timeramount= totalTimerValue/abcdef*100
if (timeramount<=100 && timeramount>90){
  timerpp.style.background="#46eb34"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=90 && timeramount>80){
  timerpp.style.background="#8feb34"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<80 && timeramount>70){
  timerpp.style.background="#b1eb34"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=70 && timeramount>60){
  timerpp.style.background="#c3eb34"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=60 && timeramount>50){
  timerpp.style.background="#ebe534"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=50 && timeramount>40){
  timerpp.style.background="#ebc034"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}

if (timeramount<=40 && timeramount>30){
  timerpp.style.background="#eba834"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}if (timeramount<=30 && timeramount>20){
  timerpp.style.background="#eb9334"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=20 && timeramount>10){
  timerpp.style.background="#eb7434"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}
if (timeramount<=10 && timeramount>0){
  timerpp.style.background="#eb4c34"
  document.getElementById("progressFront").innerHTML = totalTimerValue.toString();

}

  timerpp.style.width=timeramount.toString()+"%"







  totalTimerValue = totalTimerValue - 1;


}
