const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // #1
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let expectedResponse = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzleString })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, expectedResponse);
        done();
      });
  });

  // #2
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done) {
    let puzzleString = "";
    let expectedResponse = "Required field missing";
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzleString })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #3
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done) {
    let puzzleString = "..a..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let expectedResponse = "Invalid characters in puzzle";
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzleString })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #4
  test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done) {
    let puzzleString = ".....9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let expectedResponse = "Expected puzzle to be 81 characters long";
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzleString })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #5
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done) {
    let puzzleString = "..4..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let expectedResponse = "Puzzle cannot be solved";
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzleString })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #6
  test("Check a puzzle placement with all fields: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = "7";
    let expectedResponse = true;
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, expectedResponse);
        done();
      });
  });

  // #7
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = "6";
    let expectedResponse = false;
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.valid, expectedResponse);
        done();
      });
  });

  // #8
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = "1";
    let expectedResponse = false;
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.valid, expectedResponse);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  // #9
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "E5";
    let value = "6";
    let expectedResponse = false;
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.valid, expectedResponse);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  // #10
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "";
    let value = "";
    let expectedResponse = "Required field(s) missing";
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #11
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = "a";
    let expectedResponse = "Invalid value";
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #12
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A11";
    let value = "1";
    let expectedResponse = "Invalid coordinate";
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #13
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "Z1";
    let value = "1";
    let expectedResponse = "Invalid coordinate";
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

  // #14
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done) {
    let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = "A";
    let expectedResponse = "Invalid value";
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzleString, coordinate: coordinate, value: value })
      .end(function(err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, expectedResponse);
        done();
      });
  });

});
