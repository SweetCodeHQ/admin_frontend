import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { Cart, Button, CartIcon } from "../components";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/black_white_logo.png";

const Navbar = () => {
  const { handleSignOut, googleUser, megaphoneUserInfo } = useContext(
    UserContext
  );

  const { cartTopics } = useContext(CartContext);

  return (
    <nav className="w-full gradient-bg-purple-welcome fixed z-20">
      <div className="w-full flex justify-between items-center p-4">
        {googleUser && (
          <>
            <Button text={"Logout"} handleClick={handleSignOut} />
            <CartIcon />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
