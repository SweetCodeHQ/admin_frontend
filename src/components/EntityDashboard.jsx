import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { EntityContext } from "../context/EntityContext";
import { ImBullhorn } from "react-icons/im";
import { HiPencilAlt } from "react-icons/hi";

const GET_PAGINATED_ENTITIES = gql`
  query EntitiesConnection($after: String, $before: String) {
    entitiesConnection(after: $after, before: $before) {
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
        ? "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        : "bg-transparent outline-none border-none pt-1 pb-1 text-sm white-glassmorphism rounded-lg"
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
            className="table-cell border-none text-white-300 bg-blue-500 text-sm p-1 w-full border-[1px] border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-purple-500"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      ) : (
        <div className="table-row">
          <div className="table-cell text-white text-left">{node.name}</div>
          <div className="table-cell text-white text-left pl-5">{node.url}</div>
          <div className="table-cell text-white text-center pl-5">
            {node.userCount}
          </div>
          <div className="table-cell text-white text-center pl-5">
            <button
              type="button"
              className="text-blue-300 w-full border-[1px] border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400"
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

const EntityTable = ({ edges, pageInfo, editEntity }) => {
  return (
    <div className="table w-full p-5 w-max">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left text-gray-300 w-[225px]">
            Name
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-gray-300 pl-5 w-[200px]">
            URL
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-left text-gray-300 pl-5 w-75">
            Users
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
        <div className="w-full blue-glassmorphism mt-5 h-[375px] justify-between">
          <EntityTable
            edges={entities?.entitiesConnection?.edges}
            pageInfo={entities?.entitiesConnection?.pageInfo}
            editEntity={editEntity}
          />
          <div className="flex justify-between content-end pl-5 pr-5">
            <div className="text-left text-blue-400">
              {entities?.entitiesConnection?.pageInfo.hasPreviousPage ? (
                <p
                  className="hover:text-purple-600 cursor-pointer"
                  onClick={() =>
                    flipEntityPage({
                      after: null,
                      before: entities.entitiesConnection.pageInfo.startCursor
                    })
                  }
                >
                  {"<<<"}
                </p>
              ) : (
                <p></p>
              )}
            </div>
            <div className="text-blue-300">
              <ImBullhorn />
            </div>
            <div className=" text-blue-400">
              {entities?.entitiesConnection?.pageInfo.hasNextPage ? (
                <p
                  className="hover:text-purple-600 cursor-pointer"
                  onClick={() =>
                    flipEntityPage({
                      after: entities.entitiesConnection.pageInfo.endCursor
                    })
                  }
                >
                  {">>>"}
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
