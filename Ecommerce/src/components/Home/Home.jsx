import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Home.css";

const BASE_URL = "http://localhost:3000/api";

class Home extends Component {
    state = {
        products: [],
        cart: JSON.parse(localStorage.getItem("cart")) || [],
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

    carouselImages = [
        "https://cdn2.hubspot.net/hubfs/53/ecommerce%20marketing.jpg",
        "https://c4.wallpaperflare.com/wallpaper/910/11/748/background-fruit-vegetables-cuts-hd-wallpaper-preview.jpg",
        "https://res.cloudinary.com/dasm9k1z9/image/upload/v1755432239/ChatGPT_Image_Aug_17_2025_05_33_15_PM_doasma.png",
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

    getQuantity = (productId) => {
        const { cart } = this.state;
        const existing = cart.find((item) => item.id === productId);
        return existing ? existing.quantity : 1;
    };

    handleIncrement = (product) => {
        const { cart } = this.state;
        const existing = cart.find((item) => item.id === product.id);

        let updatedCart;
        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 2 }];
        }

        this.setState({ cart: updatedCart });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    handleDecrement = (product) => {
        const { cart } = this.state;
        const existing = cart.find((item) => item.id === product.id);
        if (!existing) return;

        let updatedCart = cart.map((item) =>
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

        let updatedCart;
        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        this.setState({ cart: updatedCart });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    render() {
        const { products, cart, selectedCategory } = this.state;
        const filteredProducts = selectedCategory
            ? products.filter((p) => p.category === selectedCategory)
            : [];

        return (
            <>
                <Navbar />
                <div className="home-layout">
                    <aside className="sidebar">
                        <h2>Categories</h2>
                        <ul>
                            {this.categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        className={`category-btn ${selectedCategory === cat ? "active" : ""
                                            }`}
                                        onClick={() => this.setState({ selectedCategory: cat })}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="cart-summary">
                            <h3>🛒 Cart</h3>
                            <p>{cart.length} items</p>
                            <Link to="/cart">
                                <button className="view-cart-btn">View Cart</button>
                            </Link>
                        </div>
                    </aside>

                    <main className="main" >
                        {!selectedCategory && (
                            <div className="carousel-container">
                                <Carousel
                                    autoPlay
                                    infiniteLoop
                                    showThumbs={false}
                                    showStatus={false}
                                    interval={5000}
                                >
                                    {this.carouselImages.map((img, index) => (
                                        <div key={index}>
                                            <img src={img} alt={`Slide ${index + 1}`} />
                                        </div>
                                    ))}
                                </Carousel>
                                <div className="welcome-msg">
                                    <h2>🛍️ Select a category to browse products</h2>
                                </div>
                            </div>
                        )}

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

                                                <div className="quantity-control">
                                                    <button onClick={() => this.handleDecrement(p)}>-</button>
                                                    <span>{this.getQuantity(p.id)}</span>
                                                    <button onClick={() => this.handleIncrement(p)}>+</button>
                                                </div>

                                                <button
                                                    className="add-to-cart"
                                                    onClick={() => this.addToCart(p)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No products in this category.</p>
                                    )}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </>
        );
    }
}

export default Home;
