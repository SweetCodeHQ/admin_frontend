import { useContext } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { EntitiesTable } from "../components";
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
          credits
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
    onCompleted: data => setEntities(data.entitiesConnection),
    fetchPolicy: "network-only"
  });

  const entityForm = {
    name: "",
    url: "",
    credits: null
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
      <EntitiesTable
        entities={entities}
        refetch={refetch}
        fetchMore={fetchMore}
        flipEntityPage={flipEntityPage}
      />
    </div>
  );
};

export default EntityDashboard;
