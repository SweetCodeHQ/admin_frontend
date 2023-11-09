import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_ENTITY = gql`
  mutation createEntity($name: String, $url: String!) {
    createEntity(input: { name: $name, url: $url }) {
      id
      name
      url
    }
  }
`;

const EDIT_ENTITY = gql`
  mutation EditEntity(
    $id: ID!
    $name: String
    $url: String
    $credits: Float
    $requestInProgress: Boolean
  ) {
    updateEntity(
      input: {
        id: $id
        name: $name
        url: $url
        credits: $credits
        requestInProgress: $requestInProgress
      }
    ) {
      id
      name
      url
      credits
      requestInProgress
    }
  }
`;

export const EntityContext = React.createContext();

export const EntityContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({ name: '', url: '' });

  const [entities, setEntities] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const sendEntity = async (formData) => {
    const input = formData;
    const promise = await entityMutationData({ variables: input });
    return promise;
  };

  const editEntity = (updateInfo) => {
    const input = updateInfo;
    entityUpdateData({ variables: input });
  };

  const [entityMutationData, { loading, error }] = useMutation(CREATE_ENTITY, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => setEntities(data.entities),
    onError: (error) => console.log(error),
  });

  const [entityUpdateData, { loading: updateLoading, error: updateError }] =
    useMutation(EDIT_ENTITY, {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
      onError: (error) => console.log(error),
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
        setEntities,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};
