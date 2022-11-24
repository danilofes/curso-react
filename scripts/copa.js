const fs = require("fs");
const csv = require("csv-parser");

let currentCup = {
  year: "",
  matches: [],
};

// Não funciona com arquivo remoto, baixar para arquivo local antes de executar
// https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/matches.csv

fs.createReadStream("./dados/matches.csv")
  .pipe(csv())
  .on("data", function (data) {
    const date = data.match_date;
    const year = date.substring(0, 4);
    if (year !== currentCup.year) {
      //writeFile();
      currentCup = {
        year,
        matches: [],
      };
    }

    const match = {
      date,
      stage: data.stage_name === "group stage" ? data.group_name : capitalize(data.stage_name),
      team1: data.home_team_name,
      team2: data.away_team_name,
      score1: parseInt(data.home_team_score),
      score2: parseInt(data.away_team_score),
    };
    currentCup.matches.push(match);

    console.log(match);
  })
  .on("end", function () {
    writeFile();
  });

function writeFile() {
  if (currentCup.matches.length) {
    fs.writeFileSync(`./dados/api/worldcup/${currentCup.year}.json`, JSON.stringify(currentCup));
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
