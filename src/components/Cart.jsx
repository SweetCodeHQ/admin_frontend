import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

import { gql, useMutation } from "@apollo/client";

const UPDATE_TOPIC = gql`
  mutation UpdateSubmitted($id: ID!, $submitted: Boolean!) {
    updateTopic(input: { id: $id, submitted: $submitted }) {
      id
      submitted
      text
    }
  }
`;

const Cart = ({ setToggleCart }) => {
  const {
    handleTopicEmail,
    handleClearCart,
    cartTopics,
    handleRemoveFromCart
  } = useContext(CartContext);

  const updateSubmitted = id => {
    const input = { submitted: true, id: id };
    topicUpdateSubmit({ variables: input });
  };

  const [
    topicUpdateSubmit,
    { loading: updateLoading, error: updateError }
  ] = useMutation(UPDATE_TOPIC, {
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const processTopics = async id => {
    await updateSubmitted(id);
    handleTopicEmail(id);
  };

  const handleSubmitTopics = () => {
    cartTopics.forEach(topic => processTopics(topic.id));
    handleClearCart();
    alert(
      "Thank you! These topics have been sent to the experts at Fixate. We'll send you an update soon."
    );
  };

  return (
    <ul className="z-10 fixed top-0 -right-2 p-3 w-[75vw] md:w-[35vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
      <div className="flex justify-between w-full">
        <div></div>
        <h1 className="font-extrabold text-2xl underline underline-offset-2">
          Your Cart
        </h1>
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
            key={i}
          />
          <p className="mr-5 w-4/5">{item.text}</p>
        </div>
      ))}
      {cartTopics.length != 0 && (
        <>
          <p className="self-center font-bold">
            You Have {cartTopics.length}{" "}
            {cartTopics.length > 1 ? "Topics" : "Topic"} in Your Cart
          </p>
          <div className="flex justify-between w-full">
            <button
              type="button"
              className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              onClick={e => handleClearCart()}
            >
              Clear All
            </button>
            <button
              type="button"
              className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              onClick={handleSubmitTopics}
            >
              Send All
            </button>
          </div>
        </>
      )}
    </ul>
  );
};

export default Cart;
