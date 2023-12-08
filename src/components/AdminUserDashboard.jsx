import { useQuery } from '@apollo/client';
import { GET_PAGINATED_USERS } from '../graphql/queries';
import { AllUsersTable } from '.';

const AdminUserDashboard = ({ userId }) => {
  const {
    data: allUsersData,
    error: allUsersError,
    refetch: allUsersRefetch,
    fetchMore,
  } = useQuery(GET_PAGINATED_USERS, {
    context: { headers: { authorization: `${process.env.EAGLE_KEY}`, user: userId } },
    onError: (error) => console.log(error),
  });

  const updateQuery = (prev, { fetchMoreResult }) =>
    fetchMoreResult.usersConnection.edges.length ? fetchMoreResult : prev;

  const flipUserPage = (params) => {
    fetchMore({
      variables: params,
      updateQuery,
    });
  };

  return (
    <div className="mt-10">
      <AllUsersTable
        connection={allUsersData?.usersConnection}
        flipPage={flipUserPage}
      />
    </div>
  );
};

export default AdminUserDashboard;
