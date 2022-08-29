import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { shortenName } from "../utils/shortenName";

const GET_ENTITIES = gql`
  query entities {
    entities {
      id
      url
      name
    }
  }
`;

const CREATE_ENTITY = gql`
  mutation createEntity($name: String!, $url: String!) {
    createEntity(input: { name: $name, url: $url }) {
      id
      name
      url
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

const EntityTableItem = ({ name, url }) => {
  return (
    <div className="table-row">
      <div className="table-cell text-white text-center">
        {shortenName(name)}
      </div>
      <div className="table-cell text-white text-center">{url}</div>
      <div className="table-cell text-white text-center">10</div>
    </div>
  );
};

const EntityTable = ({ entities }) => {
  return (
    <div className="table w-full mt-5 blue-glassmorphism p-5">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-center text-gray-300">
            Name
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-center text-gray-300">
            URL
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-center text-gray-300">
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

const Entities = () => {
  const { data } = useQuery(GET_ENTITIES);

  const [entityMutationData, { loading, error }] = useMutation(CREATE_ENTITY, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const [formData, setFormData] = useState({ name: "", url: "" });

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = e => {
    const { name, url } = formData;

    e.preventDefault();

    if (!name || !url) return;

    sendEntity(formData);

    setFormData({ name: "", url: "" });
  };

  const sendEntity = formData => {
    const input = formData;
    entityMutationData({ variables: input });
  };

  return (
    <div className="flex w-full justify-center items-center 2xl:px20">
      <div className="flex flex-col items-center md:p-12 py-12 px-4 w-full">
        <h3 className="text-white text-3xl text-center my-2">Entities</h3>
        <div className="p-5 pt-3 mt-3 sm:w-96 w-full flex flex-col justify-start items-start blue-glassmorphism">
          <Input
            placeholder="Name LLC"
            name="name"
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="www.url.com"
            name="url"
            type="text"
            handleChange={handleChange}
          />
          <div className="h-[1px] w-full bg-gray-400 my-2" />
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
          >
            Create
          </button>
        </div>
        <EntityTable {...data} />
      </div>
    </div>
  );
};
export default Entities;
