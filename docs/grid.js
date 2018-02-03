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

function stripRow(rawRow) {
  return rawRow.reduce(function(soFar, current) {
    if (current == -1) {
      return soFar;
    }
    soFar.push(current);
    return soFar;
  }, []);
}

function padRow(combined) {
  if (combined.length < 4) {
    return Array(4 - combined.length).fill(-1).concat(combined);
  } else {
    return combined;
  }
}

function moveRow(row) {
  row = stripRow(row);
  let combined = combine({
    row: row,
    score: 0
  });
  combined["row"] = padRow(combined["row"]);
  return combined;
}

function moveRight(g) {
  let newCombined = [
    moveRow([g[0], g[1], g[2], g[3]]),
    moveRow([g[4], g[5], g[6], g[7]]),
    moveRow([g[8], g[9], g[10], g[11]]),
    moveRow([g[12], g[13], g[14], g[15]])
  ];
  return {
    grid: newCombined.reduce(function(g, row) {
      return g.concat(row["row"]);
    }, []),
    score: newCombined.reduce(function(s, row) {
      return s + row["score"];
    }, 0)
  };
}

// Rotate grid 90 degrees clockwise
function rotateGrid(g) {
  return [
    g[12], g[8], g[4], g[0],
    g[13], g[9], g[5], g[1],
    g[14], g[10], g[6], g[2],
    g[15], g[11], g[7], g[3]
  ];
}

// Rotate grid 90 degrees counterclockwise
function rotateGridCounter(g) {
  return [
    g[3], g[7], g[11], g[15],
    g[2], g[6], g[10], g[14],
    g[1], g[5], g[9], g[13],
    g[0], g[4], g[8], g[12]
  ];
}

// Rotate grid 180 degrees
function rotateGrid180(g) {
  g.reverse();
  return g;
}

function getMoves(g) {
  // Right
  let moves = [moveRight(g)];

  // Up
  g = rotateGrid(g);
  let up = moveRight(g);
  up["grid"] = rotateGridCounter(up["grid"]);
  moves.push(up);

  // Left
  g = rotateGrid(g);
  let left = moveRight(g);
  left["grid"] = rotateGrid180(left["grid"]);
  moves.push(left);

  // Down
  g = rotateGrid(g);
  let down = moveRight(g);
  down["grid"] = rotateGrid(down["grid"]);
  moves.push(down);

  return moves;
}
