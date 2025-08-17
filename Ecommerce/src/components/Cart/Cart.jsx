import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Cart.css";

class Cart extends Component {
  state = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
  };

  updateCart = (updatedCart) => {
    this.setState({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  increment = (id) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.updateCart(updatedCart);
  };

  decrement = (id) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    this.updateCart(updatedCart);
  };

  removeItem = (id) => {
    const updatedCart = this.state.cart.filter((item) => item.id !== id);
    this.updateCart(updatedCart);
  };

  getTotal = () => {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  render() {
    const { cart } = this.state;

    return (
      <>
        <Navbar />
        <div className="cart-layout">
          <h2>🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. <Link to="/">Go shopping!</Link></p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.product_image} alt={item.name} />
                  <div className="item-details">
                    <p className="name">{item.name}</p>
                    <p className="price">₹{item.price}</p>
                    <div className="quantity-control">
                      <button onClick={() => this.decrement(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => this.increment(item.id)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => this.removeItem(item.id)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))}

              <div className="total-bill">
                <h3>Total: ₹{this.getTotal()}</h3>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Cart;
