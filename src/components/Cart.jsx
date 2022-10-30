import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const Cart = ({ setToggleCart }) => {
  const {
    handleTopicEmail,
    handleClearCart,
    cartTopics,
    handleRemoveFromCart
  } = useContext(CartContext);

  const handleSubmitTopics = () => {
    cartTopics.forEach(topic => handleTopicEmail(topic.id));
    handleClearCart();
    {
      /* change status or submitted? attribute to true */
    }
  };

  return (
    <ul className="z-10 fixed top-0 -right-2 p-3 w-[75vw] md:w-[35vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
      <div className="flex justify-between w-full">
        <div></div>
        <h1 className="font-bold text-2xl">Your Cart</h1>
        <AiOutlineClose
          fontSize={28}
          className="text-white cursor-pointer mb-5"
          onClick={() => setToggleCart(false)}
        />
      </div>
      {cartTopics.length === 0 && (
        <p className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold self-center">
          Your cart is empty!
        </p>
      )}
      {cartTopics.map((item, i) => (
        <div className="items-center mb-5 flex justify-between w-full">
          <MdDeleteForever
            fontSize={20}
            className="text-white font-bold mr-10 flex-none cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            onClick={e => handleRemoveFromCart(i)}
          />
          <p className="mr-5 w-4/5">{item.text}</p>
        </div>
      ))}
      {cartTopics.length != 0 && (
        <div className="flex justify-between w-full">
          <button
            type="button"
            className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            onClick={e => handleClearCart()}
          >
            Clear Cart
          </button>
          <button
            type="button"
            className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            onClick={handleSubmitTopics}
          >
            Send All Topics
          </button>
        </div>
      )}
    </ul>
  );
};

export default Cart;
