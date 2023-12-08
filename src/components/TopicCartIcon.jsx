import { useContext } from 'react';
import { BsCart4, BsCartCheckFill } from 'react-icons/bs';
import { CartContext } from '../context/CartContext';

const TopicCartIcon = ({ topic }) => {
  const { handleAddToCart, cartTopics, handleRemoveFromCart } =
    useContext(CartContext);

  const cartIds = cartTopics?.map((item) => item.id);

  return (
    <>
      {cartIds?.includes(topic?.id) ? (
        <button className="text-blue-300 rounded-full text-2xl">
          <BsCartCheckFill />
        </button>
      ) : (
        <button
          type="button"
          className={`text-blue-300 text-2xl rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${
            topic?.submitted && 'hidden'
          }`}
          onClick={(e) => handleAddToCart(topic)}
        >
          <BsCart4 />
        </button>
      )}
    </>
  );
};

export default TopicCartIcon;
