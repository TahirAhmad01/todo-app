import React from "react";
import Logo from "../assets/image/todo_logo.png";
import GoogleLogin from "./GoogleLogin";

function Nav() {
  return (
    <div className="h-[70px] bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center px-8 sticky top-0 z-50">
      <div className="flex-grow text-xl font-bold text-slate-900 flex items-center tracking-tight">
        <img src={Logo} alt="logo" className="h-8 w-8 mr-3" />
        <span>Todo App</span>
      </div>
      <div>
        <GoogleLogin />
      </div>
    </div>
  );
}

export default Nav;
