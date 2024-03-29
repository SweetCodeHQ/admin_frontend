import { useContext } from 'react';
import { EntityContext } from '../context'
import { EntityContextProvider } from '../context/EntityContext';
import { EntityDashboard, AdminUserDashboard, BannerDashboard } from '.';

const AdminDashboards = ({ userId }) => {
  const formData = useContext(EntityContext);

  return (
    <>
      <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
        Use this portal to manage administrators, entities, users, and more.
      </p>
      <div className="flex flex-col flex-1 items-center justify-start mf:mt-0 mt-10">
        <BannerDashboard userId={userId} />
        <EntityContextProvider formData={formData}>
          <EntityDashboard userId={userId} />
        </EntityContextProvider>
        <AdminUserDashboard userId={userId} />
      </div>
    </>
  );
};

export default AdminDashboards;
