import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { EntityContext } from "../context/EntityContext";
import { ImBullhorn } from "react-icons/im";
import { HiPencilAlt, HiOutlineX } from "react-icons/hi";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill
} from "react-icons/bs";

const GET_PAGINATED_ENTITIES = gql`
  query EntitiesConnection($after: String, $before: String, $last: Int) {
    entitiesConnection(after: $after, before: $before, last: $last) {
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          url
          userCount
          topicCount
        }
      }
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
    className={
      placeholder === "Name LLC" || placeholder === "www.url.com"
        ? "my-2 w-full rounded-sm p-2 outline-none bg-transparent bg-[#4E376A]/75 placeholder-gray-400 border-none text-sm shadow-inner shadow-lg text-white border-none text-sm white-glassmorphism"
        : "bg-transparent outline-none border-[1px] pt-1 pb-1 text-sm white-glassmorphism rounded-lg"
    }
  />
);

const EntityTableItem = ({ node, editEntity }) => {
  const [clicked, setClicked] = useState(false);

  const [itemFormData, setItemFormData] = useState({
    name: node.name,
    url: node.url,
    id: node.id
  });

  const handleChange = (e, name) => {
    setItemFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = e => {
    const { name, url } = itemFormData;

    if (!name && !url) return;

    editEntity(itemFormData);
    setClicked(prevState => !prevState);
  };

  return (
    <>
      {clicked ? (
        <div className="table-row text-blue-100/75 text-left">
          <div className="table-cell pt-2 pb-2">
            <Input
              placeholder={node.name}
              name="name"
              value={itemFormData.name}
              type="text"
              handleChange={handleChange}
            />
          </div>
          <div className="table-cell text-blue-100/75 text-left pt-2 pb-2">
            <Input
              placeholder={node.url}
              name="url"
              value={itemFormData.url}
              type="text"
              handleChange={handleChange}
            />
          </div>
          <button
            className="table-cell border-none text-[#2D104F] bg-white pr-2 pl-2 font-semibold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            onClick={handleSubmit}
          >
            Update
          </button>
          <div className="table-cell text-white text-center pl-5">
            <button
              type="button"
              className="text-blue-300 w-full  border-[1px] border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              onClick={() => {
                setClicked(prevState => !clicked);
              }}
            >
              <HiOutlineX />
            </button>
          </div>
        </div>
      ) : (
        <div className="table-row">
          <div className="table-cell text-white text-left">{node.name}</div>
          <div className="table-cell text-white text-left pl-5 hidden md:block">
            {node.url}
          </div>
          <div className="table-cell text-white text-center pl-5">
            {node.userCount}
          </div>
          <div className="table-cell text-white text-center pl-5">
            {node.topicCount}
          </div>
          <div className="table-cell text-white text-center pl-5">
            <button
              type="button"
              className="text-blue-300 w-full outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              onClick={() => {
                setClicked(prevState => !clicked);
              }}
            >
              <HiPencilAlt />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const EntityTable = ({ edges, editEntity }) => {
  return (
    <div className="table p-5">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left text-white font-bold">
            NAME
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-white font-bold pl-5 hidden md:block">
            URL
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-white font-bold pl-5">
            USERS
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-white font-bold pl-5">
            TOPICS
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
        </div>
      </div>
      <div className="table-row-group">
        {edges?.map((edge, i) => (
          <EntityTableItem key={i} node={edge.node} editEntity={editEntity} />
        ))}
      </div>
    </div>
  );
};
{
  /*Need to add error handling. Probably "throw error or whatever".

  Add a sortby name on BE for entities?
  */
}
const EntityDashboard = () => {
  const {
    formData,
    setFormData,
    handleChange,
    sendEntity,
    editEntity,
    entities,
    setEntities
  } = useContext(EntityContext);

  const { data, refetch, fetchMore } = useQuery(GET_PAGINATED_ENTITIES, {
    onError: error => console.log(error),
    onCompleted: data => setEntities(data),
    fetchPolicy: "network-first"
  });

  const updateQuery = (prev, { fetchMoreResult }) => {
    return fetchMoreResult.entitiesConnection.edges.length
      ? fetchMoreResult
      : prev;
  };

  const flipEntityPage = params => {
    fetchMore({
      variables: params,
      updateQuery
    });
  };

  const handleSubmit = e => {
    const { name, url } = formData;

    if (!name || !url) return;

    sendEntity(formData);
    setFormData({ name: "", url: "" });
    refetch();
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex md:p-12 w-full flex-col md:flex-row">
        <div className="w-full flex flex-col mr-5">
          <h3 className="text-white font-bold text-3xl text-center my-2">
            Entities
          </h3>
          <div className="p-5 pt-3 mt-3 w-4/5 md:w-full self-center flex flex-col justify-start items-start blue-glassmorphism bg-[#3A1F5C]">
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
              className="text-[#2D104F] self-center bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            >
              Create
            </button>
          </div>
        </div>
        <div className="flex flex-wrap content-between h-[450px] w-3/5 blue-glassmorphism self-center bg-[#3A1F5C] mt-5 justify-between">
          <div>
            <EntityTable
              edges={entities?.entitiesConnection?.edges}
              editEntity={editEntity}
            />
          </div>
          <div className="flex justify-between content-end pl-5 pr-5 w-full">
            <div className="text-left text-blue-400">
              {entities?.entitiesConnection?.pageInfo.hasPreviousPage ? (
                <p
                  className="cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 text-xl"
                  onClick={() =>
                    flipEntityPage({
                      last: 10,
                      before: entities.entitiesConnection.pageInfo.startCursor
                    })
                  }
                >
                  <BsFillArrowLeftCircleFill />
                </p>
              ) : (
                <p></p>
              )}
            </div>
            <div className="text-blue-300 pb-8">
              <ImBullhorn />
            </div>
            <div className=" text-blue-400">
              {entities?.entitiesConnection?.pageInfo.hasNextPage ? (
                <p
                  className="cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 text-xl"
                  onClick={() =>
                    flipEntityPage({
                      after: entities.entitiesConnection.pageInfo.endCursor
                    })
                  }
                >
                  <BsFillArrowRightCircleFill />
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDashboard;
