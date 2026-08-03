/**
 * @jest-environment jsdom
 */
import {
    Ship, 
    Gameboard
} from "../battleship.js"
test("correct defaults", () => {
    const testShip = new Ship(4);
    expect(testShip.length).toBe(4);
    expect(testShip.hits).toBe(0);
    expect(testShip.sunk).toBe(false);
})
test("can be hit correctly", () => {
    const testShip = new Ship(3);
    testShip.hit();
    testShip.hit();
    expect(testShip.hits).toBe(2);
})
test("can sink correctly" , () => {
    const testShip = new Ship(3);
    expect(testShip.isSunk()).toBe(false);
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBe(false);
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
})
test('places and validates ships', () => {
    const testBoard = new Gameboard();
    const testShip1 = new Ship(3);
    testBoard.placeShip(testShip1, 0, 0, true);
    expect(testBoard.grid[0][0]).not.toBeNull();
    expect(testBoard.grid[1][0]).not.toBeNull();
    expect(testBoard.grid[2][0]).not.toBeNull();
    expect(testBoard.grid[0][1]).toBeNull();
    const testShip2 = new Ship(2);
    // Won't place ship that overlaps
    expect(testBoard.placeShip(testShip2, 1, 0, false)).toBe(false);
    expect(testBoard.grid[1][1]).toBeNull();
    // Won't place ship that's out of bounds
    const testShip3 = new Ship(3);
    expect(testBoard.placeShip(testShip3, 8, 0, true)).toBe(false);
    expect(testBoard.grid[8][0]).toBeNull();
})
test('correctly misses', () => {
    const testBoard = new Gameboard();
    const testShip = new Ship(3);
    testBoard.placeShip(testShip, 0, 0, true);
    testBoard.receiveAttack(5,5);
    expect(testBoard.grid[5][5].hit).toBe(true);
    expect(testShip.hits).toBe(0);
})
test('handles duplicate hit (no ship)', () => {
    const testBoard = new Gameboard();
    testBoard.receiveAttack(3,5);
    expect(testBoard.receiveAttack(3,5)).toBe(false);
})
test('handles duplicate hit (ship)', () => {
    const testBoard = new Gameboard();
    const testShip = new Ship(2);
    testBoard.placeShip(testShip, 3, 5, true);
    testBoard.receiveAttack(3,5);
    expect(testBoard.receiveAttack(3,5)).toBe(false);
})
test('correctly hits', () => {
    const testBoard = new Gameboard();
    const testShip = new Ship(2);
    testBoard.placeShip(testShip, 3, 5, true);
    testBoard.receiveAttack(3,5);
    expect(testBoard.grid[3][5].hit).toBe(true);
    expect(testShip.hits).toBe(1);
})
test('correctly sinks', () => {
    const testBoard = new Gameboard();
    const testShip = new Ship(2);
    testBoard.placeShip(testShip, 3, 5, true);
    testBoard.receiveAttack(3,5);
    testBoard.receiveAttack(4,5);
    expect(testBoard.grid[3][5].hit).toBe(true);
    expect(testBoard.grid[4][5].hit).toBe(true);
    expect(testShip.hits).toBe(2);
    expect(testShip.isSunk()).toBe(true);
    expect(testBoard.allSunk()).toBe(true);
})