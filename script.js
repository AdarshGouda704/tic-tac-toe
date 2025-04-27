const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-btn');
const modeToggleButton = document.getElementById('mode-toggle');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isAI = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize
startGame();

function startGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = "Player X's turn";
  cells.forEach((cell, index) => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.addEventListener('click', handleCellClick, { once: true });
  });
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index] !== '') return;

  makeMove(index, currentPlayer);
  if (checkWin(currentPlayer)) {
    statusDisplay.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusDisplay.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `${currentPlayer}'s turn`;

  if (isAI && currentPlayer === 'O') {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, 'O');
      if (checkWin('O')) {
        statusDisplay.textContent = 'O wins!';
        gameActive = false;
        return;
      }
      if (board.every(cell => cell !== '')) {
        statusDisplay.textContent = 'Draw!';
        gameActive = false;
        return;
      }
      currentPlayer = 'X';
      statusDisplay.textContent = "Player X's turn";
    }, 500); // Delay to mimic thinking
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add(player);
}

function checkWin(player) {
  return winningConditions.some(condition => {
    return condition.every(index => board[index] === player);
  });
}

restartButton.addEventListener('click', startGame);

modeToggleButton.addEventListener('click', () => {
  isAI = !isAI;
  modeToggleButton.textContent = isAI ? 'Switch to PvP' : 'Switch to AI';
  startGame();
});

// --- Minimax Algorithm for unbeatable AI ---

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (newBoard.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
