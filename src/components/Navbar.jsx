import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContextProvider } from "../context/CartContext";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

import logo from "../../images/black_white_logo.png";

const CartItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

const Navbar = () => {
  const [toggleCart, setToggleCart] = useState(false);
  const { handleSignOut, googleUser } = useContext(UserContext);

  const handleSubmitTopics = () => {
    {
      /* .map through cartTopics, send email, set cartTopics to [], change submitted? attribute to true */
    }
  };

  return (
    <nav className="w-full gradient-bg-purple-welcome fixed">
      <div className="w-full flex justify-between items-center p-4">
        <img
          src={logo}
          alt="Megaphone Logo"
          className="h-[35px]"
          data-cy="HLogo"
        />
        {googleUser && (
          <>
            <BsCart4
              className="text-3xl cursor-pointer text-white"
              onClick={() => setToggleCart(true)}
            />
            <button
              className="bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-semibold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              type="button"
              onClick={e => handleSignOut(e)}
            >
              Logout
            </button>
          </>
        )}
        {toggleCart && (
          <>
            <CartContextProvider>
              <ul className="z-10 fixed top-0 -right-2 p-3 w-[75vw] md:w-[35vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
                <AiOutlineClose
                  fontSize={28}
                  className="text-white cursor-pointer mb-5"
                  onClick={() => setToggleCart(false)}
                />
                <li className="flex items-center">
                  <MdDeleteForever
                    fontSize={20}
                    className="text-white font-bold mr-10"
                  />
                  Topic Text
                </li>
                <li onClick={() => setCartTopics([])}>Clear Cart</li>
                <li onClick={() => handleSubmitTopics}>Send All Topics</li>
              </ul>
            </CartContextProvider>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
