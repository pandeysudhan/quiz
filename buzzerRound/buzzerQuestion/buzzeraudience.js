const path = require("path");
const db = require("electron-db");
const questionLocation = path.join(__dirname, "");
var finalQuestion = decodeURIComponent(window.location.search);
finalQuestion = finalQuestion.substring(1);
console.log(finalQuestion);
getQuestion();
document.getElementById("question").innerHTML = finalQuestion;
function goback() {
  window.history.back();
}
function showAnswer() {
  document.getElementById("correctAnswer").style.display = "block";
}
function gohome() {
  window.location.href = "../buzzerRound.html";
}
function getQuestion() {
  queryString = decodeURIComponent(window.location.search);
  queryString = queryString.substring(1);

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
