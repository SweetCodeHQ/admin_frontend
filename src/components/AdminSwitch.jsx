import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

const CHANGE_ADMIN_STATUS = gql`
  mutation updateUser($id: ID!, $isAdmin: Boolean!) {
    updateUser(input: { id: $id, isAdmin: $isAdmin }) {
      id
      email
      isAdmin
    }
  }
`;

export const AdminSwitch = ({ isOn, index, userId }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const enabledClass = "transform translate-x-5 bg-purple-500";

  const changeAdmin = changeStatusTo => {
    const input = { id: userId, isAdmin: changeStatusTo };
    userUpdateData({ variables: input });
  };

  const [userUpdateData, { loading, mutationError }] = useMutation(
    CHANGE_ADMIN_STATUS,
    {
      onCompleted: data => console.log(data),
      onError: error => console.log(error)
    }
  );

  const handleEnableClick = () => {
    var newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    changeAdmin(newEnabled);
  };

  useEffect(() => {
    setIsEnabled(isOn);
  }, []);

  return (
    <>
      <div
        className="md:w-10 md:h-4 w-10 h-3 flex items-center white-glassmorphism rounded-full p-1 cursor-pointer"
        onClick={() => {
          handleEnableClick();
        }}
      >
        <div
          className={
            "white-glassmorphism md:w-3 md:h-3 h-2 w-2 rounded-full shadow-md transform duration-300 ease-in-out" +
            (isEnabled ? enabledClass : null)
          }
        ></div>
      </div>
    </>
  );
};
