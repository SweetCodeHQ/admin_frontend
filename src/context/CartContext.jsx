import React, { useState, useEffect } from 'react';

export const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartTopics, setCartTopics] = useState(() => {
    const saved = localStorage.getItem('cartTopics');
    const initialValue = JSON.parse(saved);

    return initialValue || [];
  });

  const updateCartTopic = (topicIndex, newContentType) => {
    console.log('updated');
    const updatedTopic = {
      ...cartTopics[topicIndex],
      contentType: newContentType,
    };

    const tempTopics = [...cartTopics];
    tempTopics.splice(topicIndex, 1, updatedTopic);
    setCartTopics(tempTopics);
  };

  const handleAddToCart = (topic) => {
    setCartTopics((prev) => [...prev, topic]);
  };

  const handleClearCart = () => {
    setCartTopics((prev) => []);
  };

  const handleRemoveFromCart = (index) => {
    setCartTopics((prev) => prev.filter((topic, i) => i !== index));
  };

  const handleTopicAlertEmail = (topicId) => {
    const url = `${process.env.MEGAPHONE_DB_URL}/topic_alert_emails?topic_id=${topicId}`;

    fetch(url, { method: 'POST' }).then((error) => console.log(error));
  };

  useEffect(() => {
    localStorage.setItem('cartTopics', JSON.stringify(cartTopics));
  }, [cartTopics]);

  return (
    <CartContext.Provider
      value={{
        cartTopics,
        handleAddToCart,
        handleTopicAlertEmail,
        handleClearCart,
        handleRemoveFromCart,
        updateCartTopic,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
