import { useContext } from "react";
import { CartContext } from "../context";
import { MdDeleteForever } from "react-icons/md";

const CartTopic = ({ i, text }) => {
  const { handleRemoveFromCart } = useContext(CartContext);

  return (
    <div className="items-center mb-5 flex justify-between w-full">
      <MdDeleteForever
        fontSize={20}
        className="text-white font-bold mr-10 flex-none cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
        onClick={e => handleRemoveFromCart(i)}
      />
      <p className="mr-5 w-4/5">{text}</p>
    </div>
  );
};

export default CartTopic;
