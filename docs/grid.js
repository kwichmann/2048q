let game = document.getElementById("game");

let grid = [];
let powerGrid = [];

for (let i = 0; i < 16; i++) {
  let square = document.createElement('div');
  grid.push(square);
  game.appendChild(square);
  // Empty square is marked by power of -1
  powerGrid.push(-1);
}

function setSquare(square, powerOfTwo) {
  let sq = grid[square];
  if (powerOfTwo >= 0) {
    sq.innerHTML = Math.pow(2, powerOfTwo);
    let g = Math.round((15 - powerOfTwo) * 255 / 15);
    sq.style.backgroundColor = "rgb(255,"+ g +",0)";
  } else {
    sq.innerHTML = "";
    sq.style.backgroundColor = "#f0f0f0";
  }
  powerGrid[square] = powerOfTwo;
}

function freeSquares() {
  let free = [];
  for (let i = 0; i < 16; i++) {
    if (grid[i].innerHTML == "") {
      free.push(i);
    }
  }
  return free;
}

function pickEmptyRandom() {
  const free = freeSquares();
  const i = Math.floor(Math.random() * free.length);
  return free[i];
}

function setRandom() {
  const squareNumber = pickEmptyRandom();
  let pot;
  if (Math.random() < 0.9) {
    pot = 0;
  } else {
    pot = 1;
  }
  setSquare(squareNumber, pot);
}

// Function which takes an object with row and score as argument
function combine(rowObject) {
  // Extract variables from object
  let row = rowObject["row"];
  let score = rowObject["score"];

  if (row.length <= 1) {
    return rowObject;
  }
  if (row.length == 2) {
    if (row[0] == row[1]) {
      return {
        row: [row[0] + 1],
        score: score + Math.pow(2, row[0] + 1),
      };
    } else {
      return rowObject;
    }
  }

  // Recursion part
  let end = {
    row: row.slice(-2),
    score: score,
  };
  let endCombined = combine(end);
  let endRow = endCombined["row"];
  let endScore = endCombined["score"];

  if (endRow.length == 1) {
    let pre = row.slice(0, row.length - 2);
    let combined = combine({
      row: pre,
      score: endScore
    });
    combined["row"] = combined["row"].concat(endRow);
    return combined;
  } else {
    let pre = row.slice(0, row.length - 1);
    let combined = combine({
      row: pre,
      score: endScore
    });
    combined["row"].push(endRow[1]);
    return combined;
  }
}

function padRow(combined) {
  if (combined.length < 4) {
    return Array(4 - combined.length).fill(-1).concat(combined);
  } else {
    return combined;
  }
}
