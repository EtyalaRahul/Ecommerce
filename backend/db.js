const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rahul",
  database: "ecommerce",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("Error occurred:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = db;
