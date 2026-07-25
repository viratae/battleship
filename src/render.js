import {
    Gameboard,
    game
} from "./battleship.js"
const renderer = (function () {
    const startingPage = document.querySelector('#startingPage');
    const buildingPage = document.querySelector('#buildingPage');
    const playerForm = document.querySelector('#playerForm');
    const playerGrid = document.querySelector('#playerGrid');

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showHide(buildingPage, startingPage);
        makeGrid(playerGrid, 10);
    });
    function showHide(show, hide) {
        show.classList.remove("hidden");
        hide.classList.add("hidden");
    }
    function makeGrid(parent, size) {
        const board = document.createElement("div");
        board.classList.add("board")
        parent.appendChild(board);
        for (let row = 0; row < size; row++) {
            const rows = document.createElement("div");
            rows.classList.add("row");
            for (let col = 0; col < size; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => {
                    addShip(game.getPlayer().activeShip, row, col, game.getPlayer());
                });
                rows.appendChild(cell);
            }
            board.appendChild(rows)
        }
    }
    let isHorizontal = true;
    const orientationButton = document.querySelector('#orientationButton');
    orientationButton.addEventListener('click', () => {
        orientationButton.classList.remove("vertical");
        isHorizontal = !isHorizontal;
        if(!isHorizontal) {
            orientationButton.classList.add("vertical");
        }
    });
    function addShip(ship, row, col, player) {
        
        if(!ship) {
            console.log("No more ships to place");
            return;
        }
        if(player.gameboard.placeShip(ship, row, col, isHorizontal)) {
            console.log("You successfully placed a ship");
            renderBoard(player);
            // Cycle to next active ship
            player.nextShip(player.activeKey);
            const placeShipName = document.querySelector('#placeShipName');
            placeShipName.textContent = player.activeKey;
        }
        console.log(player.gameboard);
    }
    function renderBoard(player) {
        
        const board = player.gameboard;
        for(let row = 0; row < board.size; row++) {
            for(let col = 0; col < board.size; col++) {
                const coord = board.grid[row][col];
                if(!coord) {
                    
                }
                else if(coord.Ship && !coord.hit) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add("ship");
                }
            }
        }
    }
    return {
        
    }
})();
export {
    renderer
}