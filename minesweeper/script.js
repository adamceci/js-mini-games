document.addEventListener('DOMContentLoaded', () => {
  // Number of mines : 12/16/21 - Easy/Intermediate/Expert
  const difficulty = {
    easy: 12,
    medium: 16,
    hard: 21
  }
  const nCells = 100;
  const nRows = 10;
  const nCols = 10;
  const nMines = 12;
  // const nMines = difficulty[getDifficulty()];
  let nCorrectFlags = 0;
  let isGameOver = false;

	const board = document.getElementById('board');
  const outcome = document.getElementById('outcome');
  const grid = Array();

  function getDifficulty() {
    let difficultyDiv = document.getElementById('ask-difficulty');
  }

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
      });
    }

    // add borders
    for (let i = 0; i < nCells; i++) {
      const firstCol = (i % nCols === 0);
      const lastCol = (i % nCols === 9);
      const firstRow = (i < 10);
      const lastRow = (i > 89);
      
      if (!firstCol)
        grid[i].style.borderLeft = '0.5px solid rgb(204, 204, 204)';
      if (!lastCol)
        grid[i].style.borderRight = '0.5px solid rgb(204, 204, 204)';
      if (!firstRow)
        grid[i].style.borderTop = '0.5px solid rgb(204, 204, 204)';
      if (!lastRow)
        grid[i].style.borderBottom = '0.5px solid rgb(204, 204, 204)';
    }
  }

  function fillNumbers() {
    for (let i = 0; i < nCells; i++) {
      let total = 0;
      const firstCol = (i % nCols === 0);
      const lastCol = (i % nCols === 9);
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
    const firstCol = (i % nCols === 0);
    const lastCol = (i % nCols === 9);
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
      if (cell.classList.contains('bomb'))
        nCorrectFlags--;
      return;
    }
    cell.classList.add('flag');
    cell.innerHTML = '🚩';

    // check for win (all flags placed on bombs)
    if (cell.classList.contains('flag') && cell.classList.contains('bomb'))
      nCorrectFlags++;
    if (nMines === nCorrectFlags) {
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