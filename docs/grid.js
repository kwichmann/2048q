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

function combine(row) {
  if (row.length <= 1) {
    return row;
  }
  if (row.length == 2) {
    if (row[0] == row[1]) {
      return [row[0] + 1];
    } else {
      return row;
    }
  }
  let endCombined = combine(row.slice(-2));
  if (endCombined.length == 1) {
    return combine(row.slice(0, row.length - 2)).concat(endCombined);
  } else {
    return combine(row.slice(0, row.length - 1)).concat(endCombined.slice(-1));
  }
}

function padRow(combined) {
  if (combined.length < 4) {
    return Array(4 - combined.length).fill(-1).concat(combined);
  } else {
    return combined;
  }
}
