import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UserContext } from '.';
import { CREATE_ENTITY, EDIT_ENTITY } from '../graphql/mutations'

export const EntityContext = React.createContext();

export const EntityContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({ name: '', url: '' });
  const { megaphoneUserInfo } = useContext(UserContext)
  
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
    context: { headers: { authorization: `${process.env.EAGLE_KEY}`, user: megaphoneUserInfo?.id } },
    onCompleted: (data) => setEntities(data.entities),
    onError: (error) => console.log(error),
  });
//in alert email, need to use the header userId and not pass it in the query params
  const [entityUpdateData, { loading: updateLoading, error: updateError }] =
    useMutation(EDIT_ENTITY, {
      context: { headers: { authorization: `${process.env.EAGLE_KEY}`, user: megaphoneUserInfo?.id } },
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
