import React, { useState, useEffect } from "react";

export const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartTopics, setCartTopics] = useState(() => {
    const saved = localStorage.getItem("cartTopics");
    const initialValue = JSON.parse(saved);

    return initialValue || [];
  });

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

  useEffect(() => {
    localStorage.setItem("cartTopics", JSON.stringify(cartTopics));
  }, [cartTopics]);

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