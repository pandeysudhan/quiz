var finalQuestion;
var finalAnswer;
var queryString;
const path = require("path");
const pointsLocation = path.join(__dirname, "../../points/");

const db = require("electron-db");
const questionLocation = path.join(__dirname, "");
var result;
whichGroup();
function whichGroup() {
  var group = decodeURIComponent(window.location.search);
  group = group.substring(1, 2);
  console.log(group);

  db.getRows(
    "points",
    pointsLocation,
    {
      G: group
    },
    (succ, data) => {
      console.log(succ);
      console.log(data);
      group = data[0].GN;
      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    }
  );

  document.getElementById("GroupName").innerHTML =
    "Congratulations! You are Correct.     <br /> Group:" + group;
}
function gohome() {
  window.location.href = "../buzzerRound.html";
}
getQuestion();
function getQuestion() {
  queryString = decodeURIComponent(window.location.search);
  queryString = queryString.substring(2);

  db.getRows(
    "buzzerQuestion",
    questionLocation,
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
      document.getElementById("question").innerHTML = finalQuestion;
      console.log(finalQuestion);
      finalAnswer = question.finalAnswer;
      document.getElementById("correctAnswer").innerHTML =
        "Answer:  " + finalAnswer;
    }
  );
}
