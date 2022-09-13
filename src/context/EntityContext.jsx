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

const EDIT_ENTITY = gql`
  mutation EditEntity($id: ID!, $name: String, $url: String) {
    updateEntity(input: { id: $id, name: $name, url: $url }) {
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

  const editEntity = updateInfo => {
    const input = updateInfo;
    entityUpdateData({ variables: input });
  };

  const [entityMutationData, { loading, error }] = useMutation(CREATE_ENTITY, {
    onCompleted: data => setEntities(data.entities),
    onError: error => console.log(error)
  });

  const [
    entityUpdateData,
    { loading: updateLoading, error: updateError }
  ] = useMutation(EDIT_ENTITY, {
    onError: error => console.log(error)
  });

  return (
    <EntityContext.Provider
      value={{
        formData,
        setFormData,
        handleChange,
        sendEntity,
        editEntity,
        entities,
        setEntities
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};
