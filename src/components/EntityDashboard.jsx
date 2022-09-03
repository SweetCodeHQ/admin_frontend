import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { EntityContext } from "../context/EntityContext";

const GET_ENTITIES = gql`
  query entities {
    entities {
      id
      url
      name
      userCount
    }
  }
`;

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const EntityTableItem = ({ name, url, userCount }) => {
  return (
    <div className="table-row">
      <div className="table-cell text-white text-left">{name}</div>
      <div className="table-cell text-white text-left pl-5">{url}</div>
      <div className="table-cell text-white text-center pl-5">{userCount}</div>
    </div>
  );
};

const EntityTable = ({ entities }) => {
  return (
    <div className="table w-full mt-5 blue-glassmorphism p-5 w-max">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left text-gray-300">
            Name
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-gray-300 pl-5">
            URL
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-gray-300 pl-5">
            Users
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
        </div>
      </div>
      <div className="table-row-group">
        {entities?.map((entity, i) => (
          <EntityTableItem key={i} {...entity} />
        ))}
      </div>
    </div>
  );
};
{
  /*Need to add error handling. Probably "throw error or whatever"*/
}
const EntityDashboard = () => {
  const { loading, data, refetch } = useQuery(GET_ENTITIES, {
    pollInterval: 500
  });

  const {
    formData,
    setFormData,
    handleChange,
    sendEntity,
    entities,
    setEntities
  } = useContext(EntityContext);

  const handleSubmit = e => {
    const { name, url } = formData;

    if (!name || !url) return;

    sendEntity(formData);
    setFormData({ name: "", url: "" });
    refetch();
  };

  return (
    <div className="flex w-full justify-center items-center 2xl:px20">
      <div className="flex flex-col items-center md:p-12 py-12 px-4 w-full">
        <h3 className="text-white text-3xl text-center my-2">Entities</h3>
        <div className="p-5 pt-3 mt-3 sm:w-96 w-full flex flex-col justify-start items-start blue-glassmorphism">
          <Input
            placeholder="Name LLC"
            name="name"
            value={formData.name}
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="www.url.com"
            name="url"
            value={formData.url}
            type="text"
            handleChange={handleChange}
          />
          <div className="h-[1px] w-full bg-gray-400 my-2" />
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-purple-800"
          >
            Create
          </button>
        </div>
        <EntityTable {...data} />
      </div>
    </div>
  );
};
export default EntityDashboard;
