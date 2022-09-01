import { gql, useQuery, useMutation } from "@apollo/client";
import { shortenName } from "../utils/shortenName";
import { AdminSwitch } from "../components/AdminSwitch";

const GET_ADMIN_USERS = gql`
  query AdminUsers {
    adminUsers {
      id
      email
      isAdmin
    }
  }
`;

const GET_FIXATE_USERS = gql`
  query FixateUsers {
    fixateUsers {
      id
      email
      isAdmin
    }
  }
`;

const UserTableItem = props => {
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
        />
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  return (
    <div className="table mt-5 blue-glassmorphism p-5">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-center text-gray-300">
            Email
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
          <div className="table-cell text-center text-gray-300">
            Admin?
            <div className="h-[1px] w-full bg-gray-400 my-2" />
          </div>
        </div>
      </div>
      <div className="table-row-group">
        {users?.map((user, i) => {
          return (
            <UserTableItem
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

const AdminUserDashboard = () => {
  const {
    data: fixateUserData,
    refetch: fixateUsersRefetch
  } = useQuery(GET_FIXATE_USERS, { onError: error => console.log(error) });

  return (
    <div className="w-full justify-center items-center 2xl:px20">
      <div className="flex flex-col items-center md:p-12 py-12 px-4 w-full">
        <h3 className="text-white text-3xl text-center my-2">Fixate Users</h3>
        <UserTable users={fixateUserData?.fixateUsers} />
      </div>
    </div>
  );
};

export default AdminUserDashboard;
