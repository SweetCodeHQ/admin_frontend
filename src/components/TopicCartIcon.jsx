import { useContext } from 'react';
import { BsCart4, BsCartCheckFill } from 'react-icons/bs';
import { RiMailCheckFill } from 'react-icons/ri';
import { CartContext } from '../context/CartContext';
import { Tooltip } from '../components'

const TopicCartIcon = ({ topic }) => {
  const { handleAddToCart, cartTopics, handleRemoveFromCart } =
    useContext(CartContext);

  const cartIds = cartTopics?.map((item) => item.id);

  return (
    <>
      {topic?.submitted ? (
        <div className="text-blue-500 text-2xl">
          <Tooltip text="Already Submitted">
            <RiMailCheckFill />
          </Tooltip>
        </div>
      ) : (
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
    )}
  </>
  );
};

export default TopicCartIcon;
