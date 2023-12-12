import { useQuery } from '@apollo/client';
import { GET_BANNERS } from '../graphql/queries';
import { Button, Loader } from '.';

const PrivacyPolicy = ({ setClickedPrivacyPolicy }) => {
  const {
    data: bannersData,
    loading,
    errors,
  } = useQuery(GET_BANNERS, {
    context: { headers: { authorization: `${process.env.QUERY_KEY}` } },
    onError: (error) => console.log(error),
    fetchPolicy: 'network-only',
  });

  const handleClosePrivacyPolicy = () => {
    // window.location.href = "https://curio.fixate.io";
    setClickedPrivacyPolicy(false);
  };

  const formatPolicyDate = () => {
    const policyDate = new Date(bannersData?.banners[1]?.updatedAt);
    const policyMonth = policyDate?.getMonth();
    const policyDay = policyDate?.getDate();
    const policyYear = policyDate?.getFullYear();

    const displayedDate = `${policyMonth + 1}/${policyDay}/${policyYear}`;

    return displayedDate;
  };

  return (
    <div className="flex text-white flex-col items-center w-1/2 px-10 self-center justify-items-center py-5">
      <h1 className="text-3xl underline underline-offset-4">Privacy Policy</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="mt-5 mb-5 whitespace-pre-line">
            {bannersData?.banners[1]?.text}
          </p>
          <p className="mb-5">Last Updated: {formatPolicyDate()}</p>
        </>
      )}
      <Button
        customStyles="w-1/2 bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:scale-105"
        text="Close"
        handleClick={handleClosePrivacyPolicy}
      />
    </div>
  );
};

export default PrivacyPolicy;
