import { gql, useQuery, useMutation } from "@apollo/client";
import { AdminSwitch } from "../components/AdminSwitch";
import { ImBullhorn } from "react-icons/im";

const GET_FIXATE_USERS = gql`
  query FixateUsers {
    fixateUsers {
      id
      email
      isAdmin
    }
  }
`;

const GET_PAGINATED_USERS = gql`
  query UsersConnection($after: String, $before: String, $last: Int) {
    usersConnection(after: $after, before: $before, last: $last) {
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
        }
      }
    }
  }
`;

const FixateUsersTableItem = props => {
  return (
    <div className="table-row">
      <div className="table-cell text-white text-center">{props.email}</div>
      <div className="table-cell text-white text-center">
        {props.isAdmin ? "Yes" : "No"}
      </div>
      <div className="table-cell text-white text-center">
        <AdminSwitch
          key={props.index}
          userId={props.userId}
          index={props.index}
          isOn={props.isAdmin}
          forAdmin={true}
        />
      </div>
    </div>
  );
};

const FixateUsersTable = ({ users }) => {
  return (
    <div className="table mt-5 blue-glassmorphism p-5">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-center text-gray-300">Email</div>
          <div className="table-cell text-center text-gray-300">Admin?</div>
        </div>
      </div>
      <div className="h-[1px] w-5/6 bg-gray-400 my-2 absolute inset-x-5 top-9" />
      <div className="table-row-group">
        {users?.map((user, i) => {
          return (
            <FixateUsersTableItem
              key={i}
              index={i}
              userId={user.id}
              email={user.email}
              isAdmin={user.isAdmin}
            />
          );
        })}
      </div>
    </div>
  );
};

const NormalUsersTableItem = props => {
  return (
    <div className="table-row">
      <div className="table-cell text-white text-left pr-5">{props.email}</div>
      <div className="table-cell text-white text-center">
        {props.isBlocked ? "Yes" : "No"}
      </div>
      <AdminSwitch
        key={props.index}
        userId={props.userId}
        index={props.index}
        isOn={props.isBlocked}
        forAdmin={false}
      />
    </div>
  );
};

const NormalUsersTable = ({ edges }) => {
  return (
    <div className="table">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left text-gray-300">Email</div>
          <div className="table-cell text-center text-gray-300">Blocked?</div>
        </div>
      </div>
      <div className="h-[1px] w-7/8 bg-gray-400 my-2 absolute inset-x-5 top-9" />
      <div className="table-row-group">
        {edges?.map((edge, i) => {
          return (
            <NormalUsersTableItem
              key={i}
              index={i}
              userId={edge.node.id}
              email={edge.node.email}
              isBlocked={edge.node.isBlocked}
            />
          );
        })}
      </div>
    </div>
  );
};

const AdminUserDashboard = () => {
  const {
    data: fixateUsersData,
    refetch: fixateUsersRefetch
  } = useQuery(GET_FIXATE_USERS, { onError: error => console.log(error) });

  const {
    data: allUsersData,
    error: allUsersError,
    refetch: allUsersRefetch,
    fetchMore
  } = useQuery(GET_PAGINATED_USERS, {
    onError: error => console.log(error)
  });

  const updateQuery = (prev, { fetchMoreResult }) => {
    return fetchMoreResult.usersConnection.edges.length
      ? fetchMoreResult
      : prev;
  };

  const flipUserPage = params => {
    fetchMore({
      variables: params,
      updateQuery
    });
  };

  return (
    <div className="justify-center items-center 2xl:px20">
      <div className="flex flex-col items-center md:p-12 py-12 px-4 w-full">
        <h3 className="text-white text-3xl text-center my-2">Fixate Users</h3>
        <FixateUsersTable users={fixateUsersData?.fixateUsers} />
        <h3 className="text-white text-3xl text-center my-2 pt-10">
          All Users
        </h3>
        <div className="w-full blue-glassmorphism mt-5 justify-between p-5">
          <NormalUsersTable {...allUsersData?.usersConnection} />
          <div className="flex justify-between content-end pl-5 pr-5">
            <div className="text-left text-blue-400 pt-3">
              {allUsersData?.usersConnection?.pageInfo.hasPreviousPage ? (
                <p
                  className="hover:text-purple-600 cursor-pointer"
                  onClick={() =>
                    flipUserPage({
                      last: 10,
                      before: allUsersData.usersConnection.pageInfo.startCursor
                    })
                  }
                >
                  {"<<<"}
                </p>
              ) : (
                <p></p>
              )}
            </div>
            <div className="text-blue-300 pt-3">
              <ImBullhorn />
            </div>
            <div className=" text-blue-400 pt-3">
              {allUsersData?.usersConnection?.pageInfo.hasNextPage ? (
                <p
                  className="hover:text-purple-600 cursor-pointer"
                  onClick={() =>
                    flipUserPage({
                      after: allUsersData.usersConnection.pageInfo.endCursor
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

export default AdminUserDashboard;
