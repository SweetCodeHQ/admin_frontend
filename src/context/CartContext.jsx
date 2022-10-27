import React, { useState } from "react";

export const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartTopics, setCartTopics] = useState([]);
  console.log(cartTopics);
  const handleAddToCart = topic => {
    setCartTopics(prev => [...prev, topic]);
  };

  const handleTopicEmail = () => {
    const url = `https://megaphone-api.herokuapp.com/email?topic_id=${topicFormData.id}`;

    fetch(url, { method: "POST" }).then(error => console.log(error));
  };

  return (
    <CartContext.Provider
      value={{ cartTopics, handleAddToCart, handleTopicEmail }}
    >
      {children}
    </CartContext.Provider>
  );
};
