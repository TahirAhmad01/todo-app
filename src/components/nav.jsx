import React from "react";
import Logo from "../assets/image/todo_logo.png";
import GoogleLogin from "./GoogleLogin";

function Nav() {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="logo" />
        <span>Todo App</span>
      </div>
      <div>
        <GoogleLogin />
      </div>
    </div>
  );
}

export default Nav;
