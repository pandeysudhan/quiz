const db = require("electron-db");
const path = require("path");
const questionLocation = path.join(__dirname, "");
const pointsLocation = path.join(__dirname, "../../points/");
var abcdef;
var pointsToGive = "10";
var typingCompleted;
//for respective passes
var passTimer = [1000, 1600, 1100, 1100, 1100, 1100]; //time in seconds *100
//add 1 in the time so that when passed the time starts at one below

//how many times the question is passed
var numberOfPasses = 0;
if (numberOfPasses == 0) {
  var totalTimerValue = passTimer[0];
  abcdef = totalTimerValue;
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

queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("********");
console.log(queryString);

console.log("********");
runRequiredFunctions();

//get the questions
function getQuestion() {
  db.getRows(
    "audioVisualQuestion",
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
      finalQuestion = "Q.N. " + queryString + ": " + question.question;
      console.log(finalQuestion);
    }
  );
  //write the question in typewriter effect
  typeWriter();
}
//the asnwer is correct
async function correct() {
  if (typingCompleted == true) {
    setNextGroupToChooseQuestion();
    settingCurrentAndNextGroup();
    console.log(currentGroupNumberToGivePoints);

    if (repeated == false) {
      //update the group points
      if (numberOfPasses >= 1) {
        pointsToGive = 5;
      }
      db.updateRow(
        "points",
        pointsLocation,
        { G: currentGroupToGivePoints },
        {
          pts:
            parseInt(points[currentGroupNumberToGivePoints].pts) +
            parseInt(pointsToGive)
        },
        (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        }
      );

      setTimeout(function() {}, 3000);
      await sleep(500);
      window.location.href =
        "correctAnswer.html?" + currentGroupToGivePoints + queryString;
      repeated = true;
    }
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
  if (typingCompleted == true) {
    pass();
    displayWhetherCorrectOrWrong("Incorrect");
  }
}
//question is passed
async function pass() {
  if (typingCompleted == true) {
    displayWhetherCorrectOrWrong("Pass");
    //remove the times up message of previous group

    await sleep(1000);
    document.getElementById("conditionOfQuestion").style.display = "none";

    numberOfPasses = numberOfPasses + 1;
    totalTimerValue = passTimer[numberOfPasses];
    abcdef = totalTimerValue;

    console.log("---------");
    console.log("---------");
    console.log("---------");
    console.log(abcdef);

    if (numberOfPasses <= 5) {
      //change the time for passed questions

      setNextGroupToChooseQuestion();

      //updates next group in database
      updateNextGroupToGivePointsInDatabase();

      // to get new group information
      getPoints();

      //sets the current group as obtained from above
      setCurrentGroup();

      //sets next group as obtained information from above
      setCurrentGroupNumberAndNextGroup();
    }
    if (numberOfPasses > 5) {
      audience();
    }
  }
}
async function timesup() {
  //remove the times up message of previous group

  numberOfPasses = numberOfPasses + 1;
  totalTimerValue = passTimer[numberOfPasses];
  abcdef = totalTimerValue;

  console.log("---------");
  console.log("---------");
  console.log("---------");
  console.log(abcdef);

  if (numberOfPasses <= 5) {
    //change the time for passed questions

    setNextGroupToChooseQuestion();

    //updates next group in database
    updateNextGroupToGivePointsInDatabase();

    // to get new group information
    getPoints();

    //sets the current group as obtained from above
    setCurrentGroup();

    //sets next group as obtained information from above
    setCurrentGroupNumberAndNextGroup();
  }
  if (numberOfPasses > 5) {
    audience();
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
  var conditionOfQuestion = document.getElementById("conditionOfQuestion");
  conditionOfQuestion.innerHTML = status;

  if (status == "Incorrect") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-danger";
  }

  if (status == "Pass") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-secondary";
  }
  if (status == "Times Up!") {
    conditionOfQuestion.style.display = "block";
    conditionOfQuestion.className = "btn btn-danger";
  }
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
// for which group is currently active
function groupToDisplay() {
  db.getRows(
    "points",
    pointsLocation,
    {
      G: currentGroupToGivePoints
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

    timesup();
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
function audience() {
  window.location.href = "audioVisualAudience.html?" + queryString;
}
