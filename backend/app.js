const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json()); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rahul",
  database: "testdb", 
});

db.connect((err) => {
  if (err) {
    console.log("Error occurred:", err);
  } else {
    console.log("Database connected successfully");
  }
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
