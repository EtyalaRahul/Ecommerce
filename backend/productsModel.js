const db = require("./db");

const createProductsTable = () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

  db.query(createTableQuery, (err, res) => {
    if (err) throw err;
    console.log("Products table creation success");
  });
};

module.exports = { createProductsTable };
