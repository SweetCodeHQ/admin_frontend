import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { Cart } from "../components";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";

import logo from "../../images/black_white_logo.png";

const Navbar = () => {
  const [toggleCart, setToggleCart] = useState(false);

  const { handleSignOut, googleUser, megaphoneUserInfo } = useContext(
    UserContext
  );

  const { cartTopics } = useContext(CartContext);

  return (
    <nav className="w-full gradient-bg-purple-welcome fixed z-50">
      <div className="w-full flex justify-between items-center p-4">
        {googleUser && (
          <>
            {!megaphoneUserInfo?.isAdmin && (
              <div className="flex">
                <BsCart4
                  className="text-3xl cursor-pointer text-white"
                  onClick={() => setToggleCart(true)}
                />
                {cartTopics.length !== 0 && (
                  <h4 className="text-purple-800 rounded-full text-base font-bold pt-1 pl-2 pr-2 pb-1 -translate-y-4 bg-yellow-400">
                    {cartTopics.length}
                  </h4>
                )}
              </div>
            )}
            <button
              className="bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              type="button"
              onClick={e => handleSignOut(e)}
            >
              Logout
            </button>
          </>
        )}
        {toggleCart && <Cart setToggleCart={setToggleCart} />}
      </div>
    </nav>
  );
};

export default Navbar;
