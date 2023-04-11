import { useState, useContext } from "react";

import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { LaunchCartModalButton } from "../components";

import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

import { gql, useMutation } from "@apollo/client";

const UPDATE_TOPIC = gql`
  mutation UpdateSubmitted($id: ID!, $submitted: Boolean!) {
    updateTopic(input: { id: $id, submitted: $submitted }) {
      id
      submitted
      text
      abstract {
        id
        text
      }
    }
  }
`;

const Cart = ({ setToggleCart }) => {
  const {
    handleTopicAlertEmail,
    handleClearCart,
    cartTopics,
    handleRemoveFromCart,
    includeGoogleDoc,
    setIncludeGoogleDoc
  } = useContext(CartContext);

  const { gToken } = useContext(UserContext);

  const updateSubmitted = async id => {
    let promise;
    const input = { submitted: true, id: id };
    promise = await topicUpdateSubmit({ variables: input });
    return promise;
  };

  const [
    topicUpdateSubmit,
    { loading: updateLoading, error: updateError }
  ] = useMutation(UPDATE_TOPIC, {
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const processTopics = async topic => {
    let promise;
    let topicInfo;

    topicInfo = await updateSubmitted(topic.id);
    const abstractText = topicInfo.data.updateTopic.abstract?.text;

    handleTopicAlertEmail(topic.id);

    if (includeGoogleDoc) {
      promise = await handleCreateGoogleDoc(topic);
      handleAddTextToDoc(promise, abstractText);
    }

    setIncludeGoogleDoc(false);
  };

  const handleSubmitTopics = () => {
    console.log("topics submitted");
    cartTopics.forEach(topic => processTopics(topic));
    handleClearCart();
    setToggleCart(false);
  };

  const handleCreateGoogleDoc = async topic => {
    let documentId;
    const url = "https://docs.googleapis.com/v1/documents";

    const fetch_options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gToken.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `CURATE: ${topic.text}`
      })
    };

    await fetch(url, fetch_options)
      .then(response => response.json())
      .then(response => {
        documentId = response.documentId;
      });
    return documentId;
  };

  const handleAddTextToDoc = (
    documentId,
    abstractText = "No Text Provided"
  ) => {
    const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    const fetch_options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gToken.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: abstractText,
              location: {
                index: 1
              }
            }
          }
        ]
      })
    };

    fetch(url, fetch_options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
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
            <LaunchCartModalButton handleSubmitTopics={handleSubmitTopics} />
          </div>
        </>
      )}
    </ul>
  );
};

export default Cart;
