import {
    Player
} from "./player.js"
import {
    renderer
} from "./render.js"
class Ship {
    constructor(length, hits = 0, sunk = false) {
        this.length = length;
        this.hits = hits;
        this.sunk = sunk;
        this.coords = null;
    }
    hit() {
        this.hits++;
    }
    isSunk() {
        if(this.hits >= this.length) {
            this.sunk = true;
        }
        return this.sunk;
    }
}
class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.grid = this.makeGrid(this.size);
        this.ships = [];
        this.shipMarked = [];
        this.playerMarked = [];
    }
    makeGrid(size) {
        let arr = [];
        for(let i = 0; i < size; i ++) {
            let row = [];
            for(let j = 0; j < size; j++) {
                row.push(null);
            }
            arr.push(row);
        }
        return arr;
    }
    placeShip(ship, x, y, isHorizontal) {
        const shipCoords = [];
        // Ship coordinates are added from left to right or top to bottom
        for(let i = 0; i < ship.length; i++) {
            if(isHorizontal) shipCoords.push([(x), (y+i)]);
            if(!isHorizontal) shipCoords.push([(x + i), (y)]);
        }
        // Check if each coordinate is valid 
        let isValid = true;
        console.log(shipCoords);
        shipCoords.forEach(coord => {
            if(!this.validateCoords(coord[0], coord[1])) {
                isValid = false;
            }
        });
        // Mark it on grid
        if(isValid) {
            this.ships.push(ship);
            ship.coords = shipCoords;
            shipCoords.forEach(coord => {
                this.grid[coord[0]][coord[1]] = {Ship: ship, hit: false};
                this.shipMarked.push([coord[0], coord[1]])
            });
            return true;
        }
        else {
            return false;
        }
    }
    validateCoords(x,y) {
        if(x >= 0 && x < this.size && y >= 0  && y < this.size) {
            if(!this.shipMarked.some(coord => coord[0] === x && coord[1] === y)) {
                return true;
            }
        }
        console.log("invalid placement");
        return false;
    }
    receiveAttack(x,y) {
        const coord = this.grid[x][y];
        // If there is no ship and no mark
        if(!coord) {
            this.grid[x][y] = {Ship: null, hit: true};
            this.playerMarked.push([x,y]);
            return "miss";
        }
        // If it has already been hit
        else if(coord.hit) {
            return false;
        }
        else if(coord.Ship && !coord.hit) {
            coord.Ship.hit();
            this.grid[x][y].hit = true;
            if(coord.Ship.isSunk()) {
                console.log("YOU SUNK A SHIP");
            }
            return true;
        }
        console.log(this.grid);
    }
    allSunk() {
        let allDown = true;
        this.ships.forEach(ship => {
            if(!ship.isSunk()) {
                allDown = false;
            }
        });
        return allDown;
    }
}
const game = (function () {
    const player = new Player(true);
    const computer = new Player(false);
    function getPlayer() {
        return player;
    }
    function getComputer() {
        return computer;
    }
    return {
        getPlayer,
        getComputer
    }
})();
function placeComputerShips() {
    const computer = game.getComputer();
    while(computer.activeShip) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5;
        if(computer.gameboard.placeShip(computer.activeShip, x, y, orientation)) {
            computer.nextShip(computer.activeKey);
        }
    }
}
placeComputerShips();

export {
    Ship,
    Gameboard,
    game
}
