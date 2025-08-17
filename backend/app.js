const db = require("./db");
const express = require("express");
const { createRegisterTable } = require("./registerModel");
const { createProductsTable } = require("./productsModel");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const bcrypt = require("bcrypt");
const cors = require("cors");
const JWT_SECRET = "mysecretkey";
app.use(cors());

//models
// createRegisterTable();
// createProductsTable();

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

//add product
app.post("/api/products/add", (req, res) => {
  const { name, price, quantity, product_image, category } = req.body;

  if (!name || !price || !quantity || !product_image || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const insertQuery = `
    INSERT INTO products (name, price, quantity, product_image, category)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [name, price, quantity, product_image, category],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "Product added successfully",
        productId: result.insertId,
      });
    }
  );
});
//  Read (Get All Products)
app.get("/api/products", (req, res) => {
  const selectQuery = `SELECT * FROM products`;

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
});

//  Read (Get Single Product by ID)
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;

  const selectQuery = `SELECT * FROM products WHERE id = ?`;

  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(results[0]);
  });
});

//  Update (Edit Product by ID)
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, product_image, category } = req.body;

  const updateQuery = `
    UPDATE products 
    SET name = ?, price = ?, quantity = ?, product_image = ?, category = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [name, price, quantity, product_image, category, id],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});

//  Delete (Remove Product by ID)
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM products WHERE id = ?`;

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  });
});
