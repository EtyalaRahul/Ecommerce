import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

const BASE_URL = "http://localhost:3000/api";

class Home extends Component {
  state = {
    products: [],
    isLoading: true,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    selectedCategory: null,
    isMobileMenuOpen: false,
    searchQuery: "",
    priceRange: 1000,
    categorySearchQuery: "",
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
      this.setState({ isLoading: true });
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      setTimeout(() => {
        this.setState({ products: data, isLoading: false });
      }, 1000); // Simulate loading delay for better UX
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
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
    
    // Animation feedback
    const button = document.getElementById(`add-to-cart-${product.id}`);
    if (button) {
      button.classList.add("pulse");
      setTimeout(() => button.classList.remove("pulse"), 500);
    }
  };

  toggleMobileMenu = () => {
    this.setState((prev) => ({ isMobileMenuOpen: !prev.isMobileMenuOpen }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleCategorySearchChange = (e) => {
    this.setState({ categorySearchQuery: e.target.value });
  };

  handlePriceChange = (e) => {
    this.setState({ priceRange: Number(e.target.value) });
  };

  selectCategory = (category) => {
    this.setState({ 
      selectedCategory: category,
      searchQuery: "",
      categorySearchQuery: "",
      priceRange: 1000
    });
    if (window.innerWidth <= 768) {
      this.setState({ isMobileMenuOpen: false });
    }
  };

  clearFilters = () => {
    this.setState({ 
      selectedCategory: null,
      searchQuery: "",
      categorySearchQuery: "",
      priceRange: 1000
    });
  };

  render() {
    const {
      products,
      isLoading,
      cart,
      selectedCategory,
      isMobileMenuOpen,
      searchQuery,
      categorySearchQuery,
      priceRange,
    } = this.state;

    const filteredProducts = products
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .filter((p) => 
        p.name.toLowerCase().includes(
          selectedCategory ? categorySearchQuery.toLowerCase() : searchQuery.toLowerCase()
        )
      )
      .filter((p) => Number(p.price) <= priceRange);

    const filteredCategories = this.categories.filter(cat => 
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <Navbar
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        />
        <div className="home-layout">
          <button
            className="mobile-menu-btn"
            onClick={this.toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
            <div className="sidebar-inner">
              <h2 className="sidebar-title">Categories</h2>
              
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
              </div>
              
              <ul className="category-list">
                <AnimatePresence>
                  {filteredCategories.map((cat) => (
                    <motion.li
                      key={cat}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        className={`category-btn ${
                          selectedCategory === cat ? "active" : ""
                        }`}
                        onClick={() => this.selectCategory(cat)}
                      >
                        {cat}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
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
                  {cart
                    .reduce(
                      (total, item) => total + Number(item.price) * item.quantity,
                      0
                    )
                    .toFixed(2)}
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
            </div>
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
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Fresh Groceries Delivered
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Shop the best quality products at affordable prices
                      </motion.p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Filter Section */}
            <motion.div 
              className="filter-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {selectedCategory && (
                <div className="category-header">
                  <h2>{selectedCategory}</h2>
                  <div className="category-actions">
                    <button 
                      onClick={this.clearFilters}
                      className="clear-filters"
                    >
                      Clear Filters
                    </button>
                    <p>{filteredProducts.length} products available</p>
                  </div>
                </div>
              )}
              
              <div className="filter-controls">
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder={
                      selectedCategory 
                        ? `Search in ${selectedCategory}...` 
                        : "Search all products..."
                    }
                    value={selectedCategory ? categorySearchQuery : searchQuery}
                    onChange={selectedCategory ? this.handleCategorySearchChange : this.handleSearchChange}
                  />
                </div>
                
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
            </motion.div>

            {/* Products */}
            <section className="category-section">
              {isLoading ? (
                <div className="loader-container">
                  <motion.div
                    className="loader"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <motion.div
                      className="loader-inner"
                      animate={{
                        rotate: -360,
                        scale: [0.8, 1, 0.8],
                      }}
                      transition={{
                        rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                      }}
                    />
                  </motion.div>
                  <motion.p
                    className="loading-text"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading fresh products...
                  </motion.p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="products-grid">
                  <AnimatePresence>
                    {filteredProducts.map((p) => (
                      <motion.div
                        className="product-card"
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        layout
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div className="product-image-container">
                          <img src={p.product_image} alt={p.name} />
                          {p.price < 100 && (
                            <div className="product-badge">
                              <motion.span 
                                className="badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                Deal!
                              </motion.span>
                            </div>
                          )}
                        </div>
                        <div className="product-info">
                          <p className="name">{p.name}</p>
                          <p className="price">₹{p.price}</p>
                        </div>
                        <div className="quantity-control">
                          <motion.button
                            onClick={() => this.handleDecrement(p)}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Decrease quantity"
                          >
                            -
                          </motion.button>
                          <span>{this.getQuantity(p.id)}</span>
                          <motion.button
                            onClick={() => this.handleIncrement(p)}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Increase quantity"
                          >
                            +
                          </motion.button>
                        </div>
                        <motion.button
                          id={`add-to-cart-${p.id}`}
                          className="add-to-cart"
                          onClick={() => this.addToCart(p)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  className="empty-category"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="https://cdn.dribbble.com/users/204955/screenshots/4930541/media/75b7b1239505520f56d354e2172f6b0a.gif" 
                    alt="No products found" 
                    className="empty-state-image"
                  />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button 
                    onClick={this.clearFilters}
                    className="clear-filters"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </section>
          </main>
        </div>
      </>
    );
  }
}

export default Home;