import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PAGINATED_ENTITIES } from '../graphql/queries';
import { EntitiesTable } from '.';
import { EntityContext } from '../context';

const EntityDashboard = ({ userId }) => {
  const { entities, setEntities } =
    useContext(EntityContext);

  const { data, refetch, fetchMore } = useQuery(GET_PAGINATED_ENTITIES, {
    context: { headers: { authorization: `${process.env.EAGLE_KEY}`, user: `${userId}` } },
    onError: (error) => console.log(error),
    onCompleted: (data) => setEntities(data.entitiesConnection),
    fetchPolicy: 'network-only',
  });

  const updateQuery = (prev, { fetchMoreResult }) =>
    fetchMoreResult.entitiesConnection.edges.length ? fetchMoreResult : prev;

  const flipEntityPage = (params) => {
    fetchMore({
      variables: params,
      updateQuery,
    });
  };

  return (
    <div className="mt-10">
      <EntitiesTable
        entities={entities}
        refetch={refetch}
        flipEntityPage={flipEntityPage}
      />
    </div>
  );
};

export default EntityDashboard;
