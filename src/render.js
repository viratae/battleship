import {
    Gameboard,
    game
} from "./battleship.js"
const renderer = (function () {
    const startingPage = document.querySelector('#startingPage');
    const buildingPage = document.querySelector('#buildingPage');
    const playerForm = document.querySelector('#playerForm');
    const buildingGrid = document.querySelector('#buildingGrid');

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showHide(buildingPage, startingPage);
        makeGrid(buildingGrid, 10, true, true);
    });
    function showHide(show, hide) {
        show.classList.remove("hidden");
        hide.classList.add("hidden");
    }
    function makeGrid(parent, size, shipMode, isPlayerGrid) {
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
                if(shipMode) {
                    cell.addEventListener('click', () => {
                        addShip(game.getPlayer().activeShip, row, col, game.getPlayer());
                    });
                }
                else {
                    if(isPlayerGrid) {
                        cell.addEventListener('click', () => {
                            hitShip(row, col, game.getComputer());
                        });
                    }
                    else {
                        cell.addEventListener('click', () => {
                            hitShip(row, col, game.getPlayer());
                        });
                    }
                }
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
        const playingPage = document.querySelector('#playingPage');
        const buildingPage = document.querySelector('#buildingPage');
        const buildingGrid = document.querySelector('#buildingGrid');
        if(!ship) {
            console.log("No more ships to place");
            return;
        }
        if(player.gameboard.placeShip(ship, row, col, isHorizontal)) {
            const playerGrid = document.querySelector('#playerGrid');
            const enemyGrid = document.querySelector('#enemyGrid');
            console.log("You successfully placed a ship");
            renderBoard(player, true, buildingGrid);
            // Cycle to next active ship
            player.nextShip(player.activeKey);
            if(!player.activeShip) {
                showHide(playingPage, buildingPage);
                makeGrid(playerGrid, 10, false, true);
                makeGrid(enemyGrid, 10, false, false)
                renderBoard(player, true, playerGrid);
            }
            const placeShipName = document.querySelector('#placeShipName');
            placeShipName.textContent = player.activeKey;
        }
        console.log(player.gameboard);
    }
    function hitShip(row, col, attacker) {
        if(attacker.isPlayer) {
            const enemy = game.getComputer();
            const enemyGrid = document.querySelector('#enemyGrid');
            if(enemy.gameboard.receiveAttack(row, col) != false) {
                renderBoard(enemy, false, enemyGrid);
                const ship = enemy.gameboard.grid[row][col].Ship
                if(ship && ship.isSunk()) {
                    console.log("HIT SHIP DETECTS SUNKEN SHIP");
                    sinkShip(ship, true)
                }
            }
        }
    }
    function sinkShip(ship, isPlayer) {
        const playerGrid = document.querySelector('#playerGrid');
        const enemyGrid = document.querySelector('#enemyGrid');
        const coords = ship.coords;
        if(!coords) {
            throw new Error("An Error Occured: No Ship Coordinates Found");
        }
        else {
            if(isPlayer) {
                console.log("Almost sank a ship?");
                coords.forEach(coord => {
                    const row = coord[0];
                    const col = coord[1];
                    const cell = enemyGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add("sunk");
                });
            }
        }
    }
    function renderBoard(player, isPlayerGrid, grid) {
        const board = player.gameboard;
        for(let row = 0; row < board.size; row++) {
            for(let col = 0; col < board.size; col++) {
                const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const coord = board.grid[row][col];
                if(!coord) {
                    
                }
                // Placing Ship
                else if(coord.Ship && !coord.hit) {
                    if(isPlayerGrid) {
                        cell.classList.add("ship");
                    }
                    else {
                    }
                }
                // Miss
                else if(!coord.Ship && coord.hit) {
                    cell.innerHTML = "";
                    const circle = document.createElement("div");
                    circle.classList.add("circle");
                    circle.classList.add("white");
                    cell.appendChild(circle);
                }
                // Hit
                else if(coord.Ship && coord.hit) {
                    cell.innerHTML = "";
                    const circle = document.createElement("div");
                    circle.classList.add("circle");
                    circle.classList.add("hit");
                    cell.appendChild(circle);
                    cell.appendChild(circle);
                }
            }
        }
        
    }
    return {
        sinkShip
    }
})();
export {
    renderer
}
