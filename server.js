const mysql = require("mysql");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cors = require("cors");

var connection = mysql.createConnection({
  host: "localhost",
  user: "Pranesh",
  password: "PRANESHJO20",
  database: "fromdata",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

app.use(express.json());

app.use(cookieParser());

app.use(cors());

// For storing data in db
app.post("/register", function (req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      let test2 = "INSERT INTO gokul SET ?";
      let post = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
      };
      connection.query(test2, post, function (req, res, err) {
        if (err) throw err;
        console.log(res);
      });
    });
  });
  res.status(200).json({ data: res.data, message: "success" });
});

//  verifying data
app.post("/login", function (req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  let e1 = req.body.email;
  let pass1 = req.body.password;
  let sql = "SELECT email,password FROM gokul";
  connection.query(sql, async function (request, response) {
    let table = response;
    let valide = await table.find((c) => c.email === e1);
    if (!valide) res.status(404).json({ message: "not avalid user" });
    else {
      bcrypt.compare(pass1, valide.password, (error, match) => {
        if (error) res.status(500).json(error);
        else if (match) {
          let token = jwt.sign({ email: valide }, "SecretKey", {
            expiresIn: "7d",
          });
          res
            .cookie("pranesh", token)
            .status(200)
            .json({ message: "Login successfully", token: token });
        } else res.status(403).json({ message: "password not match" });
      });
    }
  });
});

app.listen(3001, () => {
  console.log("Server runnign in the 3001 port");
});
