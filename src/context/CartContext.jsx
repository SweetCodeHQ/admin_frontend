import React, { useState } from "react";

export const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartTopics, setCartTopics] = useState([]);

  const handleAddToCart = topic => {
    setCartTopics(prev => [...prev, topic]);
  };

  const handleClearCart = () => {
    setCartTopics(prev => []);
  };

  const handleRemoveFromCart = index => {
    setCartTopics(prev => prev.filter((topic, i) => i !== index));
  };

  const handleTopicEmail = topicId => {
    const url = `https://megaphone-api.herokuapp.com/email?topic_id=${topicId}`;

    fetch(url, { method: "POST" }).then(error => console.log(error));
  };

  return (
    <CartContext.Provider
      value={{
        cartTopics,
        handleAddToCart,
        handleTopicEmail,
        handleClearCart,
        handleRemoveFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
