import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_ENTITY = gql`
  mutation createEntity($name: String!, $url: String!) {
    createEntity(input: { name: $name, url: $url }) {
      id
      name
      url
    }
  }
`;

export const EntityContext = React.createContext();

export const EntityContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({ name: "", url: "" });

  const [entities, setEntities] = useState([]);

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const sendEntity = formData => {
    const input = formData;
    entityMutationData({ variables: input });
  };

  const [entityMutationData, { loading, error }] = useMutation(CREATE_ENTITY, {
    onCompleted: data => setEntities(data.entities),
    onError: error => console.log(error)
  });

  return (
    <EntityContext.Provider
      value={{
        formData,
        setFormData,
        handleChange,
        sendEntity,
        entities,
        setEntities
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};
