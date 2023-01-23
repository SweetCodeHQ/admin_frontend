import { CartContext } from "../context/CartContext";
import { BsCart4 } from "react-icons/bs";
import { BsCartCheckFill } from "react-icons/bs";

const TopicCartIcon = ({ topic, handleAddToCart, cartIds }) => {
  return (
    <>
      {cartIds?.includes(topic.id) ? (
        <button className="text-blue-300 mr-3 rounded-full text-xl">
          <BsCartCheckFill />
        </button>
      ) : (
        <button
          type="button"
          className={`text-blue-300 mr-3 text-xl rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
            "hidden"}`}
          onClick={e => handleAddToCart(topic)}
        >
          <BsCart4 />
        </button>
      )}
    </>
  );
};

export default TopicCartIcon;
