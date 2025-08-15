const db = require("./db");
const express = require("express");
const { createRegisterTable } = require("./registerModel");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const bcrypt = require("bcrypt");
const cors = require("cors");
const JWT_SECRET = "mysecretkey";
app.use(cors());

//models
// createRegisterTable();

//register route
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone_number, password, gender, age } =
    req.body;
  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
    !password ||
    !gender ||
    !age
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const insertQuery = `
    INSERT INTO users
    (first_name, last_name, email, phone_number, password, gender, age)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    insertQuery,
    [first_name, last_name, email, phone_number, hashedPassword, gender, age],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Email or phone number already exists" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    }
  );
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ jwt_token: token });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
//list out all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

//test route
app.get("/", (req, res) => {
  res.send("Server is running - Rahul Etyala");
});

app.listen(3000, () => {
  console.log("app is listening");
});
