const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  //1
  test("Logic handles a valid puzzle string of 81 characters", function(done) {
    let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.solve(input), "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
    done();
  });

  //2
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function(done) {
    let input = "invalidString";
    assert.equal(solver.solve(input), false);
    done();
  });

  //3
  test("Logic handles a puzzle string that is not 81 characters in length", function(done) {
    let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6";
    assert.equal(solver.solve(input), false);
    done();
  });

  //4
  test("Logic handles a valid row placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A1";
    let value = "7";

    assert.equal(solver.checkRowPlacement(puzzleString, coordinate[0], coordinate[1], value), true);
    done();
  });

  //5
  test("Logic handles an invalid row placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A2";
    let value = "1";
    assert.equal(solver.checkRowPlacement(puzzleString, coordinate[0], coordinate[1], value), false);
    done();
  });

  //6
  test("Logic handles a valid column placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A2";
    let value = "7";
    assert.equal(solver.checkColPlacement(puzzleString, coordinate[0], coordinate[1], value), true);
    done();
  });

  //7
  test("Logic handles an invalid column placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A1";
    let value = "1";
    assert.equal(solver.checkColPlacement(puzzleString, coordinate[0], coordinate[1], value), false);
    done();
  });

  //8
  test("Logic handles a valid region (3x3 grid) placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A2";
    let value = "7";
    assert.equal(solver.checkRegionPlacement(puzzleString, coordinate[0], coordinate[1], value), true);
    done();
  });

  //9
  test("Logic handles an invalid region (3x3 grid) placement", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let coordinate = "A2";
    let value = "4";
    assert.equal(solver.checkRegionPlacement(puzzleString, coordinate[0], coordinate[1], value), false);
    done();
  });

  //10
  test("Valid puzzle strings pass the solver", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    assert.equal(solver.solve(puzzleString), "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
    done();
  });

  //11
  test("Invalid puzzle strings fail the solver", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6."
    assert.equal(solver.solve(puzzleString), false);
    done();
  });

  //12
  test("Solver returns the expected solution for an incomplete puzzle", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    let expectedSolution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
    assert.equal(solver.solve(puzzleString), expectedSolution);
    done();
  });

});
