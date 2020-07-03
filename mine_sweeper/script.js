// Number of mines : 12/16/21 - Easy/Intermediate/Expert
// Start with 12

const nCells = 100;
const nRows = 10;
const nCols = 10;
const nMines = 12;
let nFlags = 0;

let isGameOver = false;

document.addEventListener('DOMContentLoaded', () => {
	const board = document.getElementById('board');
  const grid = Array();
  const outcome = document.getElementById('outcome');

  function shuffle(array) {
    let currentIndex = nCells - 1;

    while (currentIndex !== 0) {
      const currVal = array[currentIndex];
      const randIndex = Math.floor(Math.random() * currentIndex);
      array[currentIndex] = array[randIndex];
      array[randIndex] = currVal;
      currentIndex--;
    }
  }

  function genCells(gameArray) {
    for (let i = 0; i < nCells; i++) {
      const cell = document.createElement('div');
      cell.setAttribute('id', i);
      cell.classList.add(gameArray[i]);
      board.appendChild(cell);
      grid.push(cell);

      cell.addEventListener('click', function(e) {
        click(cell);
      });
      cell.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        placeFlag(cell);
      })
    }
  }

  function fillNumbers() {
    for (let i = 0; i < nCells; i++) {
      let total = 0;
      const firstCol = (i % 10 === 0);
      const lastCol = (i % 10 === 9);
      const firstRow = (i < 10);
      const lastRow = (i > 89);

      if (grid[i].classList.contains('valid')) {
        if (!firstCol && grid[i - 1].classList.contains('bomb')) total++;
        if (!firstCol && !firstRow && grid[i - 11].classList.contains('bomb')) total++;
        if (!firstRow && grid[i - 10].classList.contains('bomb')) total++;
        if (!firstRow && !lastCol && grid[i - 9].classList.contains('bomb')) total++;
        if (!lastCol && grid[i + 1].classList.contains('bomb')) total++;
        if (!lastRow && !lastCol && grid[i + 11].classList.contains('bomb')) total++;
        if (!lastRow && grid[i + 10].classList.contains('bomb')) total++;
        if (!firstCol && !lastRow && grid[i + 9].classList.contains('bomb')) total++;
        grid[i].setAttribute('data', total);
      }
    }
  }

	function createBoard() {
    const minesArray = Array(nMines).fill('bomb');
    const emptyArray = Array(nCells - nMines).fill('valid');

    let gameArray = minesArray.concat(emptyArray)
    shuffle(gameArray);
    // Create cells
    genCells(gameArray);
    // Fill numbers
    fillNumbers();
  }

  createBoard();

  function checkNeighbours(cell) {
    const i = parseInt(cell.id);
    const firstCol = (i % 10 === 0);
    const lastCol = (i % 10 === 9);
    const firstRow = (i < 10);
    const lastRow = (i > 89 && i < 100);

    setTimeout(() => {
      if (!firstCol) {
        const newIndex = i - 1;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!firstCol && !firstRow) {
        const newIndex = i - nCols - 1;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!firstRow) {
        const newIndex = i - nCols;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!firstRow && !lastCol) {
        const newIndex = i - nCols + 1
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!lastCol) {
        const newIndex = i + 1;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!lastRow && !lastCol) {
        const newIndex = i + nCols + 1;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!lastRow) {
        const newIndex = i + nCols;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
      if (!firstCol && !lastRow) {
        const newIndex = i + nCols - 1;
        const newCell = document.getElementById(newIndex);
        click(newCell);
      }
    }, 10);
  }

  function click(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
    if (cell.classList.contains('bomb')) {
      gameOver(cell);
    } else {
      let total = cell.getAttribute('data');
      if (total != 0) {
        cell.innerHTML = total;
        // return;
      } else {
        checkNeighbours(cell);
      }
    }
    cell.classList.add('checked');
  }

  function placeFlag(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('checked')) {console.log('checked'); return;}
    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag');
      cell.innerHTML = '';
      nFlags--;
      return;
    }
    cell.classList.add('flag');
    cell.innerHTML = '🚩';
    nFlags++;
    // check for win (all flags placed on bombs)
    let nCorrectFlags = 0;
    grid.forEach(cell => {
      if (cell.classList.contains('flag') && cell.classList.contains('bomb')) {
        nCorrectFlags++;
      }
    });
    if (nFlags === nMines && nMines === nCorrectFlags) {
      outcome.innerHTML = 'Congratulations! You win';
      isGameOver = true;
    }
  }

  function gameOver(cell) {
    outcome.innerHTML = 'You lose!';
    cell.classList.add('failure');
    cell.innerHTML = '💣';
    isGameOver = true;

    // Display all mines
    for (let i = 0; i < nCells; i++) {
      if (grid[i].classList.contains('bomb')) {
        grid[i].classList.add('failure');
        grid[i].innerHTML = '💣';
      }
    }
  }
});