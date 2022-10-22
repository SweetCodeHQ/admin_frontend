import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/black_white_logo.png";

const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { handleSignOut, googleUser } = useContext(UserContext);

  return (
    <nav className="w-full flex justify-between p-4">
      <div></div>
      <img
        src={logo}
        alt="Megaphone Logo"
        className="h-[35px]"
        data-cy="HLogo"
      />

      {/*cart will live here.
        <Cart />
        render (
        <div className="menu-related stuff">
        cartItems.map(item => <CartItem text={item.text} />)

        Clear Cart

        Submit topic for writing. What does confirmation look like? Will Debi email them?
      )

      Docket, ledger, pile, stack, cabinet, desk, notebook,
        <CartItem />
        trashIcon, text

        How many topics will they purchase?
        Need an icon.
        State=toggleCart.
        If cart is toggled, then there's a popup/ menu that shows topics in cart.
        Probably need to add it to localstorage, too.
        There probably also needs to be a state that saves/updates cart.
        Iterate through cart array.
        topicText, deleteIcon, submitted?

        Add submitted? attribute to topics?

        Can use the NavBar already written below. Need a transparent purple glassmorphism.

        Have a section where topics are submitted? Then, include their status? In admin dash, create a section with topic submissions.

        */}
      {googleUser && (
        <button
          className="bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-semibold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
          type="button"
          onClick={e => handleSignOut(e)}
        >
          Logout
        </button>
      )}
      {/* For if there's a real navbar.
        <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["My Topics", "Request Topics", "Share of Conversation"].map(
              (item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classProps="my-2 text-lg"
                />
              )
            )}
          </ul>
        )}
      </div>*/}
    </nav>
  );
};

export default Navbar;
