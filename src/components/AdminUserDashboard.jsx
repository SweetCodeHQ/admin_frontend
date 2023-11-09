import { gql, useQuery, useMutation } from '@apollo/client';
import { AllUsersTable } from '.';

const GET_PAGINATED_USERS = gql`
  query UsersConnection($after: String, $before: String, $last: Int) {
    usersConnection(after: $after, before: $before, last: $last) {
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
          email
          isBlocked
          topicCount
          loginCount
          clickedGenerateCount
          createdAt
          isAdmin
        }
      }
    }
  }
`;

const AdminUserDashboard = () => {
  const {
    data: allUsersData,
    error: allUsersError,
    refetch: allUsersRefetch,
    fetchMore,
  } = useQuery(GET_PAGINATED_USERS, {
    context: { headers: { authorization: `${process.env.EAGLE_KEY}` } },
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
