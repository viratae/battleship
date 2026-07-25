import {
    Ship,
    Gameboard
} from "./battleship.js"
class Player {
    constructor(isComputer = false) {
        this.gameboard = new Gameboard();
        this.ships = {
            carrier: new Ship(5),
            battleship: new Ship(4),
            destroyer: new Ship(3),
            submarine: new Ship(3),
            patrol: new Ship(2)
        }
        this.isComputer = isComputer;
        this.activeShip = this.ships.carrier;
        this.activeKey = "carrier"
    }
    nextShip(activeKey) {
        const keys = Object.keys(this.ships);
        const currentIndex = keys.indexOf(activeKey);

        if (currentIndex === -1 || currentIndex === keys.length - 1) {
            this.activeShip = null;
        }
        this.activeKey = keys[currentIndex + 1];  
        this.activeShip = this.ships[this.activeKey];
        console.log(this.activeShip);
    }
}
export {
    Player
}
