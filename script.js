const board = document.getElementById("board");
const statusText = document.getElementById("status");
const banner = document.getElementById("victoryBanner");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let mode = "";
let scores = { X: 0, O: 0 };

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame(selectedMode) {
  mode = selectedMode;
  scores = { X: 0, O: 0 };
  updateScore();
  createBoard();
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
}

function createBoard() {
  board.innerHTML = "";
  banner.classList.remove("show");
  cells = Array(9).fill("");

  cells.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => makeMove(i));
    board.appendChild(cell);
  });
}

function makeMove(index) {
  if (!gameActive || cells[index] !== "") return;

  cells[index] = currentPlayer;
  const cell = board.children[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWinner()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (mode === "cpu" && currentPlayer === "O") {
    setTimeout(cpuMove, 500);
  }
}

function cpuMove() {
  let empty = cells
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null);

  let move = empty[Math.floor(Math.random()*empty.length)];
  makeMove(move);
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;

    if (cells[a] &&
        cells[a] === cells[b] &&
        cells[a] === cells[c]) {

      highlightWin(a,b,c);

      banner.textContent = cells[a] + " WINS!";
      banner.classList.add("show");

      scores[cells[a]]++;
      updateScore();
      nextRound();
      return true;
    }
  }

  if (!cells.includes("")) {
    statusText.textContent = "Draw!";
    nextRound();
    return true;
  }

  return false;
}

function highlightWin(a,b,c) {
  [a,b,c].forEach(i => {
    const cell = board.children[i];
    cell.style.transform = "scale(1.2)";
    cell.style.boxShadow = "0 0 20px #00ffcc";
  });
}

function nextRound() {
  gameActive = false;

  if (scores.X === 2 || scores.O === 2) {
    statusText.textContent = "Match Winner!";
    return;
  }

  setTimeout(() => {
    createBoard();
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
  }, 1500);
}

function updateScore() {
  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
}

function resetMatch() {
  scores = { X: 0, O: 0 };
  updateScore();
  startGame(mode);
}