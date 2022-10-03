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
  const { handleSignOut, user } = useContext(UserContext);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          src={logo}
          alt="Megaphone Logo"
          className="w-32 cursor-pointer"
          data-cy="HLogo"
        />
      </div>
      {user && (
        <>
          <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial object-left">
            {["Fixate", "Sweet Code"].map((item, index) => (
              <NavbarItem key={item + index} title={item} />
            ))}
          </ul>
          <button
            className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-purple-800 text-white transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            type="button"
            onClick={e => handleSignOut(e)}
          >
            Logout
          </button>
        </>
      )}
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
      </div>
    </nav>
  );
};

export default Navbar;
