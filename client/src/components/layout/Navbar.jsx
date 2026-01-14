import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="py-5 bg-brand text-white text-2xl">
      <div className="container flex items-center justify-between">
        <Link to="/">Shortner</Link>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
