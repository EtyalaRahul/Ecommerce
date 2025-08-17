import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";
import "./Home.css";

const BASE_URL = "http://localhost:3000/api";

class Home extends Component {
  state = {
    products: [],
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    selectedCategory: null,
    isMobileMenuOpen: false,
    searchQuery: "",
    priceRange: 1000,
  };

  categories = [
    "Prepared Foods",
    "Canned Foods & Soups",
    "Bakery",
    "Dairy & Eggs",
    "Frozen",
    "Meat & Seafood",
    "Snacks & Confectionery",
    "Beverages",
    "Grains & Pulses",
    "Fruits",
    "Vegetables",
    "Spices & Condiments",
    "Cooking Essentials",
    "Household Supplies",
    "Noodles",
  ];

  carouselImages = [
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  ];

  componentDidMount() {
    this.fetchProducts();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
      this.setState({ isMobileMenuOpen: false });
    }
  };

  fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      this.setState({ products: data });
    } catch (err) {
      console.error(err);
    }
  };

  getQuantity = (productId) => {
    const { cart } = this.state;
    const existing = cart.find((item) => item.id === productId);
    return existing ? existing.quantity : 1;
  };

  handleIncrement = (product) => {
    const { cart } = this.state;
    const existing = cart.find((item) => item.id === product.id);
    let updatedCart = existing
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 2 }];
    this.setState({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  handleDecrement = (product) => {
    const { cart } = this.state;
    const existing = cart.find((item) => item.id === product.id);
    if (!existing) return;
    const updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    this.setState({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  addToCart = (product) => {
    const { cart } = this.state;
    const existing = cart.find((item) => item.id === product.id);
    const updatedCart = existing
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
    this.setState({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  toggleMobileMenu = () => {
    this.setState((prev) => ({ isMobileMenuOpen: !prev.isMobileMenuOpen }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handlePriceChange = (e) => {
    this.setState({ priceRange: Number(e.target.value) });
  };

  render() {
    const {
      products,
      cart,
      selectedCategory,
      isMobileMenuOpen,
      searchQuery,
      priceRange,
    } = this.state;

    const filteredProducts = products
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((p) => Number(p.price) <= priceRange);

    return (
      <>
        <Navbar
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        />
        <div className="home-layout">
          <button
            className="mobile-menu-btn"
            onClick={this.toggleMobileMenu}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
            <h2 className="sidebar-title">Categories</h2>
            <ul className="category-list">
              {this.categories.map((cat) => (
                <motion.li
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className={`category-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => {
                      this.setState({ selectedCategory: cat });
                      if (window.innerWidth <= 768) {
                        this.setState({ isMobileMenuOpen: false });
                      }
                    }}
                  >
                    {cat}
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="cart-summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3>🛒 Cart Summary</h3>
              <p>{cart.reduce((acc, item) => acc + item.quantity, 0)} items</p>
              <p>
                ₹
                {cart.reduce(
                  (total, item) => total + Number(item.price) * item.quantity,
                  0
                )}
              </p>
              <Link to="/cart">
                <motion.button
                  className="view-cart-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Cart
                </motion.button>
              </Link>
            </motion.div>
          </aside>

          <main className="main">
            {/* Carousel */}
            <div className="carousel-container">
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={5000}
                showArrows={true}
                dynamicHeight={false}
                emulateTouch={true}
              >
                {this.carouselImages.map((img, index) => (
                  <div key={index} className="carousel-slide">
                    <img src={img} alt={`Slide ${index + 1}`} />
                    <div className="carousel-overlay"></div>
                    <div className="carousel-content">
                      <h2>Fresh Groceries Delivered</h2>
                      <p>
                        Shop the best quality products at affordable prices
                      </p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Search & Price Filter */}
            <div className="filter-section">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
              <div className="price-range">
                <label>Max Price: ₹{priceRange}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange}
                  onChange={this.handlePriceChange}
                />
              </div>
            </div>

            {/* Products */}
            <motion.section
              className="category-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {selectedCategory && (
                <div className="category-header">
                  <h2>{selectedCategory}</h2>
                  <p>{filteredProducts.length} products available</p>
                </div>
              )}
              <div className="products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <motion.div
                      className="product-card"
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="product-image-container">
                        <img src={p.product_image} alt={p.name} />
                      </div>
                      <div className="product-info">
                        <p className="name">{p.name}</p>
                        <p className="price">₹{p.price}</p>
                      </div>
                      <div className="quantity-control">
                        <motion.button
                          onClick={() => this.handleDecrement(p)}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span>{this.getQuantity(p.id)}</span>
                        <motion.button
                          onClick={() => this.handleIncrement(p)}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        className="add-to-cart"
                        onClick={() => this.addToCart(p)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="empty-category"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p>No products found.</p>
                  </motion.div>
                )}
              </div>
            </motion.section>
          </main>
        </div>
      </>
    );
  }
}

export default Home;
