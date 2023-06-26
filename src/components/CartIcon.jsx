import { useContext, useState } from "react";
import { Cart } from "../components";
import { CartContext, UserContext } from "../context";
import { EntityContextProvider } from "../context/EntityContext";

import { BsCart4 } from "react-icons/bs";

const CartIcon = () => {
  const [toggleCart, setToggleCart] = useState(false);

  const { cartTopics } = useContext(CartContext);
  const { megaphoneUserInfo } = useContext(UserContext);

  return (
    <>
      {!megaphoneUserInfo?.isAdmin && (
        <>
          <div className="flex">
            <BsCart4
              className="text-3xl cursor-pointer text-white"
              onClick={() => setToggleCart(true)}
            />
            {cartTopics.length !== 0 && (
              <h4 className="text-purple-800 rounded-full text-base font-bold pt-1 pl-2 pr-2 pb-1 -translate-y-4 z-5 bg-yellow-400">
                {cartTopics.length}
              </h4>
            )}
          </div>
          <EntityContextProvider>
            {toggleCart && <Cart setToggleCart={setToggleCart} />}
          </EntityContextProvider>
        </>
      )}
    </>
  );
};

export default CartIcon;
