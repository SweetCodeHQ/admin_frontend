import { useState, useContext } from "react";
import { CartTopicContentType } from "../components";
import { CartContext } from "../context";
import { MdDeleteForever } from "react-icons/md";

const CartTopic = ({ i, topic }) => {
  const { handleRemoveFromCart } = useContext(CartContext);

  return (
    <div className="items-center mb-5 w-full">
      <CartTopicContentType
        contentType={topic.contentType}
        topicId={topic.id}
        topicIndex={i}
      />
      <div className="flex mt-3">
        <MdDeleteForever
          fontSize={20}
          className="text-white font-bold mr-10 flex-none cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
          onClick={e => handleRemoveFromCart(i)}
        />
        <p className="mr-5 w-4/5">{topic.text}</p>
      </div>
      <div className="h-[1px] bg-gray-300 mt-3" />
    </div>
  );
};

export default CartTopic;
