import { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_ADMIN_STATUS } from '../graphql/mutations';
import { UserContext } from '../context';

export const AdminSwitch = ({ isOn, userId, forAdmin }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const { megaphoneUserInfo } = useContext(UserContext);

  const enabledClass = 'transform translate-x-5 bg-purple-500';

  const flipStatus = (changeStatusTo) => {
    const input = forAdmin
      ? { id: userId, isAdmin: changeStatusTo }
      : { id: userId, isBlocked: changeStatusTo };
    userUpdateData({ variables: input });
  };

  const [userUpdateData] = useMutation(
    UPDATE_ADMIN_STATUS,
    {
      context: { headers: { authorization: `${process.env.EAGLE_KEY}`, user: megaphoneUserInfo?.id } },
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
