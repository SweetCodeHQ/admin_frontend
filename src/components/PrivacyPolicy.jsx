import { gql, useQuery } from "@apollo/client";

import { Button, Loader } from "../components";

const GET_BANNERS = gql`
  query Banners {
    banners {
      purpose
      text
      link
      updatedAt
    }
  }
`;

const PrivacyPolicy = ({ setClickedPrivacyPolicy }) => {
  const { data: bannersData, loading, errors } = useQuery(GET_BANNERS, {
    onError: error => console.log(error),
    fetchPolicy: "network-only"
  });

  const formatPolicyDate = () => {
    const policyDate = new Date(bannersData?.banners[1]?.updatedAt);

    const policyMonth = policyDate?.getMonth();
    const policyDay = policyDate?.getDay();
    const policyYear = policyDate?.getFullYear();

    const displayedDate = `${policyMonth}/${policyDay}/${policyYear}`;

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
        handleClick={() => setClickedPrivacyPolicy(false)}
      />
    </div>
  );
};

export default PrivacyPolicy;