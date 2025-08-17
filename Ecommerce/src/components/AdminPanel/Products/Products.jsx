import React, { Component } from "react";
import "./Products.css";

const BASE_URL = "http://localhost:3000/api"; // ✅ Define once

class Products extends Component {
  state = {
    products: [],
    formData: {
      id: null,
      name: "",
      price: "",
      quantity: "",
      category: "",
      product_image: "",
    },
    uploading: false,
    showDeleteConfirm: false,
    productToDelete: null,
    selectedCategory: null,
  };

  categories = [
    "Produce",
    "Prepared foods",
    "Canned foods & Soups",
    "Bakery",
    "Dairy & Eggs",
    "Frozen",
    "Meat & Seafood",
    "Toys & Games",
    "Books & Stationery",
    "Fruits",
    "Noodles",
  ];

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      this.setState({ products: data });
    } catch (err) {
      console.error(err);
    }
  };

  handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) this.uploadToCloudinary(file);
  };

  uploadToCloudinary = async (file) => {
    const cloudName = "dasm9k1z9";
    const preset = "fsad_preset";
    this.setState({ uploading: true });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        this.setState((prev) => ({
          formData: { ...prev.formData, product_image: data.secure_url },
          uploading: false,
        }));
      }
    } catch (err) {
      console.error(err);
      this.setState({ uploading: false });
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...data } = this.state.formData;
    try {
      if (id) {
        await fetch(`${BASE_URL}/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`${BASE_URL}/products/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      this.resetForm();
      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  handleEdit = (p) => {
    this.setState({ formData: { ...p } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleDeleteConfirm = (p) => {
    this.setState({ showDeleteConfirm: true, productToDelete: p });
  };

  handleDelete = async () => {
    const { productToDelete } = this.state;
    try {
      await fetch(`${BASE_URL}/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      this.setState({ showDeleteConfirm: false, productToDelete: null });
      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        id: null,
        name: "",
        price: "",
        quantity: "",
        category: "",
        product_image: "",
      },
    });
  };

  removeImage = () => {
    this.setState((prev) => ({
      formData: { ...prev.formData, product_image: "" },
    }));
  };

  render() {
    const { products, formData, uploading, showDeleteConfirm, selectedCategory } =
      this.state;

    const filteredProducts = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : [];

    return (
      <div className="products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Categories</h2>
          <ul>
            {this.categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`category-btn ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => this.setState({ selectedCategory: cat })}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Form */}
          <div className="form-card">
            <h3>{formData.id ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={this.handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={this.handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={this.handleChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={this.handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={this.handleChange}
                required
              >
                <option value="">Select Category</option>
                {this.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input type="file" onChange={this.handleFileSelect} />

              {/* Drag & Drop */}
              <div
                id="drop-area"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("hover");
                }}
                onDragLeave={(e) => e.currentTarget.classList.remove("hover")}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("hover");
                  const files = e.dataTransfer.files;
                  if (files.length > 0 && files[0].type.startsWith("image/")) {
                    this.uploadToCloudinary(files[0]);
                  } else {
                    alert("Please drop a valid image file.");
                  }
                }}
              >
                Drop your image here
              </div>

              {uploading && <p>Uploading...</p>}
              {formData.product_image && (
                <div className="preview-container">
                  <img
                    src={formData.product_image}
                    alt="preview"
                    className="preview"
                  />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={this.removeImage}
                  >
                    ✖
                  </button>
                </div>
              )}

              <button type="submit">
                {formData.id ? "Update" : "Add"}
              </button>
            </form>
          </div>

          {selectedCategory && (
            <section className="category-section">
              <h2>{selectedCategory}</h2>
              <div className="products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div className="product-card" key={p.id}>
                      <img src={p.product_image} alt={p.name} />
                      <p className="name">{p.name}</p>
                      <p className="price">₹{p.price}</p>
                      <p className="qty">Qty: {p.quantity}</p>
                      <div className="buttons">
                        <button
                          className="edit"
                          onClick={() => this.handleEdit(p)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete"
                          onClick={() => this.handleDeleteConfirm(p)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found in this category.</p>
                )}
              </div>
            </section>
          )}
        </main>

        {showDeleteConfirm && (
          <div className="popup">
            <div className="popup-content">
              <p>Delete this product?</p>
              <button onClick={this.handleDelete}>Yes</button>
              <button
                onClick={() => this.setState({ showDeleteConfirm: false })}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Products;
