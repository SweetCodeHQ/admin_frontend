import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const UPDATE_ADMIN_STATUS = gql`
  mutation updateUser($id: ID!, $isAdmin: Boolean, $isBlocked: Boolean) {
    updateUser(input: { id: $id, isAdmin: $isAdmin, isBlocked: $isBlocked }) {
      id
      email
      isAdmin
      isBlocked
    }
  }
`;

export const AdminSwitch = ({ isOn, userId, forAdmin }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const enabledClass = 'transform translate-x-5 bg-purple-500';

  const flipStatus = (changeStatusTo) => {
    const input = forAdmin
      ? { id: userId, isAdmin: changeStatusTo }
      : { id: userId, isBlocked: changeStatusTo };
    userUpdateData({ variables: input });
  };

  const [userUpdateData, { loading, mutationError }] = useMutation(
    UPDATE_ADMIN_STATUS,
    {
      context: { headers: { authorization: `${process.env.EAGLE_KEY}` } },
      onCompleted: (data) => console.log(data),
      onError: (error) => console.log(error),
    }
  );

  const handleEnableClick = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    flipStatus(newEnabled);
  };

  useEffect(() => {
    setIsEnabled(isOn);
  }, []);

  return (
    <div
      className="md:w-10 md:h-4 w-10 h-3 flex items-center white-glassmorphism rounded-full p-1 cursor-pointer"
      onClick={() => {
        handleEnableClick();
      }}
    >
      <div
        className={`white-glassmorphism md:w-3 md:h-3 h-2 w-2 rounded-full shadow-md transform duration-300 ease-in-out${
          isEnabled ? enabledClass : null
        }`}
      />
    </div>
  );
};

export default AdminSwitch;
