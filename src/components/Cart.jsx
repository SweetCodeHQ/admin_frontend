import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

import { gql, useMutation } from "@apollo/client";

import "tw-elements";

const UPDATE_TOPIC = gql`
  mutation UpdateSubmitted($id: ID!, $submitted: Boolean!) {
    updateTopic(input: { id: $id, submitted: $submitted }) {
      id
      submitted
      text
    }
  }
`;

const LaunchModalButton = ({ handleSubmitTopics }) => {
  return (
    <>
      {/*<button
        type="button"
        className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
        onClick={handleSubmitTopics}
      >
        Send All
      </button>*/}
      <button
        type="button"
        className="pr-5 pl-5 p-2 mt-2 text-[#2D104F] bg-white font-bold text-base leading-tight rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 hover:text-white active:shadow-lg transition duration-150 ease-in-out"
        data-bs-toggle="modal"
        data-bs-target="#submitTopicsConfirmation"
      >
        Send All
      </button>
      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="submitTopicsConfirmation"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-[#2D104F]">
              <h5
                className="text-xl font-medium leading-normal text-white"
                id="exampleModalLabel"
              >
                Send these topics?
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 bg-white text-white border-none rounded-full opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body relative p-4 text-black bg-purple-100">
              Click "Send Topics" to confirm that you want to send these topics
              to the experts at Fixate.
            </div>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md bg-purple-300">
              <button
                type="button"
                className="px-6 py-2.5 bg-white text-[#2D104F] font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:shadow-lg focus:bg-purple-700 focus:shadow-lg line-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-105"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1 hover:-translate-y-1 hover:scale-105"
                onClick={handleSubmitTopics}
              >
                Send Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
            <LaunchModalButton handleSubmitTopics={handleSubmitTopics} />
          </div>
        </>
      )}
    </ul>
  );
};

export default Cart;
