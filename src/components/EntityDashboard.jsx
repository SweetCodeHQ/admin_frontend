import { useContext } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Table } from "../components";
import { EntityContext } from "../context/EntityContext";

const GET_PAGINATED_ENTITIES = gql`
  query EntitiesConnection($after: String, $before: String, $last: Int) {
    entitiesConnection(after: $after, before: $before, last: $last) {
      totalCount
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

const EntityDashboard = () => {
  const { sendEntity, editEntity, entities, setEntities } = useContext(
    EntityContext
  );

  const { data, refetch, fetchMore } = useQuery(GET_PAGINATED_ENTITIES, {
    onError: error => console.log(error),
    onCompleted: data => setEntities(data),
    fetchPolicy: "network-first"
  });

  const entityForm = {
    name: "",
    url: ""
  };

  const handleCreateEntity = async data => {
    await sendEntity(data);
    refetch();
  };

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

  return (
    <div className="mt-10">
      <Table
        tableName="Entities"
        tableDescription="A list of all companies in our database."
        headers={["name", "url", "userCount", "topicCount"]}
        connection={entities?.entitiesConnection}
        flipPage={flipEntityPage}
        form={entityForm}
        handleCreate={handleCreateEntity}
        handleEdit={editEntity}
      />
    </div>
  );
};

export default EntityDashboard;
