import { useState, useRef, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Input, ExpandableTextArea } from "../components";
import {
  LinkIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from "@heroicons/react/24/solid";

const GET_BANNERS = gql`
  query Banners {
    banners {
      id
      purpose
      text
      link
    }
  }
`;

const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $link: String, $text: String) {
    updateBanner(input: { id: $id, link: $link, text: $text }) {
      id
      text
      link
    }
  }
`;

const Banner = ({ title, banner, refetch }) => {
  const [formData, setFormData] = useState({
    id: banner?.id,
    text: banner?.text,
    link: banner?.link
  });
  useEffect(() => {
    setFormData({
      id: banner?.id,
      text: banner?.text,
      link: banner?.link
    });
  }, [banner]);

  const [editEnabled, setEditEnabled] = useState(false);

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSave = () => {
    setEditEnabled(false);
    if (formData.text === banner.text && formData.link === banner.link) return;

    updateBanner();
    setFormData(prev => ({
      ...prev,
      text: banner.text,
      link: banner.link
    }));
  };

  const updateBanner = () => {
    const input = formData;
    updateBannerData({ variables: input });
  };

  const [updateBannerData, { error: updateBannerError }] = useMutation(
    UPDATE_BANNER,
    {
      onCompleted: refetch,
      onError: error => console.log(error)
    }
  );

  return (
    <div
      className={`mr-10 mt-10 w-full ${
        editEnabled ? null : "divide-y divide-gray-300"
      }`}
    >
      <div className="flex justify-between">
        <h2 className="mr-4 text-white">{title}</h2>
        {editEnabled ? (
          <button
            className="text-sm font-bold text-indigo-500 hover:text-indigo-300"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="text-sm font-bold text-indigo-500 hover:text-indigo-300"
            onClick={() => setEditEnabled(true)}
          >
            Edit
          </button>
        )}
      </div>
      {editEnabled ? (
        <div>
          <Input
            placeholder="Add a link"
            name="link"
            type="text"
            defaultValue={banner.link}
            handleChange={handleChange}
          />
          <ExpandableTextArea
            handleChange={handleChange}
            placeholder={title}
            name="text"
            defaultValue={banner.text}
            textBoxOpener={editEnabled}
            formData={formData}
          />
        </div>
      ) : (
        <div className="text-gray-300">
          <div className="mt-1 flex">
            <h4 className="h-4 w-4 mr-4 py-1">
              <LinkIcon />
            </h4>
            <p>{banner?.link ? banner?.link : "NONE"}</p>
          </div>
          <div className="flex">
            <div className="h-5 w-5 mr-3 py-1 shrink-0">
              <ChatBubbleOvalLeftEllipsisIcon />
            </div>
            <p className="max-h-[250px] overflow-auto overscroll-contain whitespace-pre-line">
              {banner?.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const BannerDashboard = () => {
  const { data: bannersData, refetch: refetchBanners } = useQuery(GET_BANNERS, {
    onError: error => console.log(error)
  });

  return (
    <div className="mt-10 pt-5 pb-5 px-4 sm:px-6 lg:px-8 bg-[#3A1F5C] rounded-xl w-3/4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold leading-6 text-white">Banners</h1>
          <p className="mt-2 text-sm text-gray-200">
            These are displayed when a user logs in.
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Banner
          key="displayBanner"
          name="displayBanner"
          title="Display Banner"
          banner={bannersData?.banners[0]}
          refetch={refetchBanners}
        />
        <Banner
          key="privacyStatement"
          name="privacyStatement"
          title="Privacy Statement"
          banner={bannersData?.banners[1]}
          refetch={refetchBanners}
        />
      </div>
    </div>
  );
};

export default BannerDashboard;
