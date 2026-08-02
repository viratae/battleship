import {
    Gameboard,
    game
} from "./battleship.js"
const renderer = (function () {
    let captainName;
    const startingPage = document.querySelector('#startingPage');
    const buildingPage = document.querySelector('#buildingPage');
    const playerForm = document.querySelector('#playerForm');
    const buildingGrid = document.querySelector('#buildingGrid');

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = document.querySelector('#playerName');
        captainName = playerName.value;
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
                    if(!isPlayerGrid) {
                        cell.addEventListener('click', () => {
                            playTurn(row, col);
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
    // coords represents queue of coordinates for computer to attack
    // hits represents a list of coordinates of the current ship that is being attacked (cleared when sunk)
    let coords = [];
    let hits = [];
    let coord;
    function playTurn(row, col) {
        const playingPage = document.querySelector('#playingPage');
        const finalPage = document.querySelector('#finalPage');
        const enemyGrid = document.querySelector('#enemyGrid');
        const playerGrid = document.querySelector('#playerGrid');
        const resultText = document.querySelector('#resultText');
        if(hitShip(row, col, game.getComputer(), enemyGrid) != false) {
            if(game.getComputer().gameboard.allSunk()) {
                console.log("The Player Wins!");
                showHide(finalPage, playingPage);
                resultText.textContent = "Captain " + captainName + " wins!";
            }
            else {
                let computerSuccess = false;
                while(!computerSuccess) {
                    // If computer has found ship
                    if(hits.length == 1 && coords.length > 0) {
                        const index = Math.floor(Math.random() * coords.length);
                        const coord = coords.splice(index, 1)[0];
                        const state = hitShip(coord[0], coord[1], game.getPlayer(), playerGrid);
                        if(state != false) {
                            computerSuccess = true;
                        }
                        if(state === "s") {
                            coords = [];
                            hits = [];
                        }
                        else if(state === "h") {
                            hits.push([coord[0], coord[1]]);
                        }
                    }
                    else if(hits.length > 1) {
                        coords = [];
                        const x1 = hits[0][0];
                        const y1 = hits[0][1];
                        const x2 = hits[1][0];
                        const y2 = hits[1][1];
                        // If x coords are the same
                        if(x1 == x2) {
                            const lowestY = Math.min(...hits.map(coord => coord[1]));
                            const highestY = Math.max(...hits.map(coord => coord[1]));
                            const moves = [[x1, highestY + 1], [x1, lowestY -1]];
                            coords = validateCoords(moves);
                        }
                        else if(y1 == y2) {
                            const lowestX = Math.min(...hits.map(coord => coord[0]));
                            const highestX = Math.max(...hits.map(coord => coord[0]));
                            const moves = [[highestX + 1, y1], [lowestX - 1, y1]]
                            coords = validateCoords(moves);
                        }
                        // If the coordinates aren't in a row, try around the most recent hit
                        else {
                            const lastHit = hits[hits.length - 1];
                            coords = validateCoords(getCoords(lastHit[0], lastHit[1]));
                        }
                        if(coords.length > 0) {
                            const index = Math.floor(Math.random() * coords.length);
                            coord = coords.splice(index, 1)[0];
                        }
                        // If there are no coords, try around last spot, then abandon
                        else {
                            const lastHit = hits[hits.length - 1];
                            coords = validateCoords(getCoords(lastHit[0], lastHit[1]));
                            if(coords.length > 0) {
                                const index = Math.floor(Math.random() * coords.length);
                                coord = coords.splice(index, 1)[0];
                            } else {
                                hits = []; 
                            }
                        }
                        if(!coord) {
                            let x, y;
                            do {
                                x = Math.floor(Math.random() * 10);
                                y = Math.floor(Math.random() * 10);
                            } while (game.getPlayer().gameboard.grid[x][y]?.hit);
                            coord = [x, y];
                        }
                        const state = hitShip(coord[0], coord[1], game.getPlayer(), playerGrid);
                        if(state != false) {
                            computerSuccess = true;
                        }
                        if(state === "s") {
                            // In case of touching ships, wipe sunk ship and target around other
                            hits = hits.filter(([x, y]) => {
                                const ship = game.getPlayer().gameboard.grid[x][y].Ship;
                                return ship && !ship.isSunk();
                            });
                            if(hits.length > 0) {
                                const activeHit = hits[hits.length - 1];
                                coords = getCoords(activeHit[0], activeHit[1]);
                            } else {
                                coords = [];
                            }
                        }
                        else if(state === "h") {
                            hits.push([coord[0], coord[1]]);
                        }
                    }
                    // If no ship has been found pick a random coordinate
                    // If it hits add it to hit list and generate coords
                    else {
                        const x = Math.floor(Math.random() * 10);
                        const y = Math.floor(Math.random() * 10);
                        const state = hitShip(x, y, game.getPlayer(), playerGrid);
                        // False is failed validation, "s" is sunk, "h" is hit, "m" is miss
                        if(state != false) {
                            computerSuccess = true;
                        }
                        if(state === "h") {
                            hits.push([x,y]);
                            coords = getCoords(x,y);
                        }
                    }
                }
                if(game.getPlayer().gameboard.allSunk()) {
                    console.log("The Computer Wins?");
                    showHide(finalPage, playingPage);
                    resultText.textContent = "You Lose";
                }
            }
        }
    }
    function getCoords(x, y) {
        const coords = [
            [x, y+1],
            [x+1, y],
            [x, y-1],
            [x-1, y]
        ]
        return validateCoords(coords);
    }
    function validateCoords(arr) {
        const validMoves = arr.filter(([x,y]) => {
            return (x >= 0 && y >= 0 && x <= 9 && y <= 9 && !game.getPlayer().gameboard.grid[x][y]?.hit);
        })
        return validMoves;
    }
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
            renderBoard(player, buildingGrid);
            // Cycle to next active ship
            player.nextShip(player.activeKey);
            if(!player.activeShip) {
                showHide(playingPage, buildingPage);
                makeGrid(playerGrid, 10, false, true);
                makeGrid(enemyGrid, 10, false, false)
                renderBoard(player, playerGrid);
            }
            const placeShipName = document.querySelector('#placeShipName');
            placeShipName.textContent = player.activeKey;
        }
        console.log(player.gameboard);
    }
    function hitShip(row, col, target, targetGrid) {
        // False if failed validation, true if hit ship, nothing if missed ship
        const state = target.gameboard.receiveAttack(row, col);
        if(state != false) {
            renderBoard(target, targetGrid);
            const ship = target.gameboard.grid[row][col].Ship;
            if(ship && ship.isSunk()) {
                sinkShip(ship, targetGrid);
                return "s";
            }
            else if(state == true) {
                return "h";
            }
            else {
                return "m";
            }
        }
        else {
            return false;
        }
    }
    function sinkShip(ship, grid) {
        const playerGrid = document.querySelector('#playerGrid');
        const enemyGrid = document.querySelector('#enemyGrid');
        const coords = ship.coords;
        if(!coords) {
            throw new Error("An Error Occured: No Ship Coordinates Found");
        }
        else {
            coords.forEach(coord => {
                const row = coord[0];
                const col = coord[1];
                const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add("sunk");
            });
        }
    }
    function renderBoard(player, grid) {
        const board = player.gameboard;
        for(let row = 0; row < board.size; row++) {
            for(let col = 0; col < board.size; col++) {
                const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const coord = board.grid[row][col];
                if(!coord) {
                    
                }
                // Placing Ship
                else if(coord.Ship && !coord.hit) {
                        cell.classList.add("ship");
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
