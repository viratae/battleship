import {
    Player
} from "./player.js"
class Ship {
    constructor(length, hits = 0, sunk = false) {
        this.length = length;
        this.hits = hits;
        this.sunk = sunk;
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
            console.log("Miss :(");
        }
        // If it has already been hit
        else if(coord.hit) {
            console.log("Repeated hit");
            return false;
        }
        else if(coord.Ship && !coord.hit) {
            console.log("YOU HIT A SHIP");
            coord.Ship.hit();
            this.grid[x][y].hit = true;
            if(coord.Ship.isSunk()) {
                console.log("YOU SUNK A SHIP");
            }
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
// const board = new Gameboard();
// const testShip1 = new Ship(3);
// const testShip2 = new Ship(2);

// board.placeShip(testShip1, 0, 0, true);
// board.placeShip(testShip2, 1, 0, false);
// board.receiveAttack(5,5);
// board.receiveAttack(5,5);
// board.receiveAttack(0,0);
// board.receiveAttack(1,0);
// console.log(board.allSunk());
// board.receiveAttack(2,0);
// console.log(board.allSunk());
const game = (function () {
    const player = new Player(false);
    const computer = new Player(true);
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

export {
    Ship,
    Gameboard,
    game
}
// Ideally render calls the gameboard placeShip and render just displays it