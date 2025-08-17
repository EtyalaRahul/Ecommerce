import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import Cookie from "js-cookie";

class Navbar extends Component {
    state = {
        loggedOut: false,
    };

    handleLogout = () => {
        Cookie.remove("jwt_token");
        this.setState({ loggedOut: true });
    };

    render() {
        if (this.state.loggedOut) {
            return <Navigate to="/login" replace />;
        }

        const isLoggedIn = Cookie.get("jwt_token") !== undefined;

        return (
            <nav
                style={{
                    padding: "10px 20px",
                    background: "#f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/dasm9k1z9/image/upload/v1755321852/WhatsApp_Image_2025-08-15_at_09.37.55_d1af3ebe_c55vgs.jpg" // replace with your logo path
                            alt="Logo"
                            style={{ height: "70px", width: "70px", borderRadius: "50%" }}
                        />
                    </Link>
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            gap: "20px",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {!isLoggedIn && (
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            gap: "20px",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {!isLoggedIn && (
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/cart">Cart</Link>
                                </li>
                            </>
                        )}
                    </ul>

                </div>

                {/* Right Section */}
                {isLoggedIn && (
                    <button
                        onClick={this.handleLogout}
                        style={{
                            background: "tomato",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>
                )}
            </nav>
        );
    }
}

export default Navbar;
