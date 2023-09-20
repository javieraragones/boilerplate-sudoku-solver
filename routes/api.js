'use strict';
require('dotenv').config()
let bodyParser = require('body-parser');

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      //Check input
      if (!puzzle || !coordinate || !value) {
        res.status(500).send({ error: 'Required field(s) missing' })
      }
      if (!/^[1-9]$/.test(value)) {
        res.status(500).send({ error: 'Invalid value' })
      }
      if (!/^[0-9.]+$/.test(puzzle)) {
        res.status(500).send({ error: 'Invalid characters in puzzle' })
      }
      if (puzzle.length !== 81) {
        res.status(500).send({ error: 'Expected puzzle to be 81 characters long' })
      }
      if (!/^[A-I][1-9]$/.test(coordinate.toUpperCase())) {
        res.status(500).send({ error: 'Invalid coordinate' })
      }
      //
      let checkRow = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value)
      let checkCol = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value)
      let checkReg = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)
      if (checkRow && checkCol && checkReg) {
        res.status(200).json({ valid: true })
      } else {
        let conflict = [];
        if (!checkRow) {
          conflict.push("row")
        }
        if (!checkCol) {
          conflict.push("column")
        }
        if (!checkReg) {
          conflict.push("region")
        }
        res.status(500).send({ valid: false, conflict: conflict })
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;

      if (!puzzle) {
        res.status(500).send({ error: 'Required field missing' })
      }
      if (puzzle.length !== 81) {
        res.status(500).send({ error: 'Expected puzzle to be 81 characters long' })
      }
      if (!/^[0-9.]+$/.test(puzzle)) {
        res.status(500).send({ error: 'Invalid characters in puzzle' })
      }

      let solution = solver.solve(puzzle);
      if (!solution) {
        res.status(500).send({ error: 'Puzzle cannot be solved' })
      }
      res.status(200).json({ solution })
    });
};
