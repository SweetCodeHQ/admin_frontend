import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { Cart, Button, CartIcon } from "../components";

const Navbar = () => {
  const { handleSignOut, googleUser } = useContext(UserContext);

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
