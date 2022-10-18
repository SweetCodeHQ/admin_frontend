import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/logo.png";

const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { handleSignOut, googleUser } = useContext(UserContext);

  return (
    <nav className="w-full flex justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-between content-end">
        <img
          src={logo}
          alt="Megaphone Logo"
          className="w-32 cursor-pointer"
          data-cy="HLogo"
        />
      </div>
      {googleUser && (
        <button
          className="bg-[#1A0B3A] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-purple-800 text-white transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
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
