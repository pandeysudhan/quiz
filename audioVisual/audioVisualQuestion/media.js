const path = require("path");
const db = require("electron-db");

const questionLocation = path.join(__dirname, "");

setMedia();
function setMedia() {
  var queryString = decodeURIComponent(window.location.search);
  queryString = queryString.substring(1);
  console.log("-----");

  console.log(queryString);

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
      console.log("mediafile:" + question.media);
      document.getElementById("mediaTobeDisplayed").style.width = "90%";
      document.getElementById("mediaTobeDisplayed").style.height = "80%";
      document.getElementById("mediaTobeDisplayed").style.borderRadius = "10px";
      document.getElementById("mediaTobeDisplayed").data = question.media;
    }
  );
}
function back() {
  window.history.back();
}
