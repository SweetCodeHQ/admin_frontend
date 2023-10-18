import { useState, useContext } from "react";
import { UserContext, CartContext, EntityContext } from "../context";

import {
  LaunchCartModalButton,
  Button,
  CartTopic,
  BasicAlert,
  Tooltip
} from "../components";
import { AiOutlineClose } from "react-icons/ai";
import { gql, useMutation } from "@apollo/client";
import { CONTENT_TYPES } from "../constants/contentTypes";

const UPDATE_TOPIC = gql`
  mutation UpdateSubmitted($id: ID!, $submitted: Boolean) {
    updateTopic(input: { id: $id, submitted: $submitted }) {
      id
      submitted
      text
      contentType
      abstract {
        id
        text
      }
    }
  }
`;

const CartButton = ({
  handleSubmitTopics,
  handleRequestCredits,
  megaphoneUserInfo,
  calculateCreditsNeeded,
  verifySelections
}) => {
  //can be moved into its own component
  return (
    <>
      {!megaphoneUserInfo.entities[0]?.credits ||
      megaphoneUserInfo.entities[0]?.credits < calculateCreditsNeeded() ? (
        <LaunchCartModalButton
          initialButtonText="Request Units"
          headerText="Request more Units?"
          bodyText="Click 'Confirm Request' to start the process. You'll receive an email with more information."
          submitButtonText="Confirm Request"
          handleClick={handleRequestCredits}
        />
      ) : (
        <LaunchCartModalButton
          handleClick={handleSubmitTopics}
          headerText="Send these topics?"
          bodyText="Click 'Send Topics' to confirm that you want to send these topics to the experts at Fixate."
          submitButtonText="Send Topics"
          initialButtonText="Send All"
        />
      )}
    </>
  );
};

const Cart = ({ setToggleCart }) => {
  const { handleTopicAlertEmail, handleClearCart, cartTopics } = useContext(
    CartContext
  );

  const { megaphoneUserInfo } = useContext(UserContext);

  const { editEntity } = useContext(EntityContext);

  const [showAlert, setShowAlert] = useState(false);

  const updateSubmitted = async id => {
    let promise;
    const input = { submitted: true, id: id };
    promise = await topicUpdateSubmit({ variables: input });
    return promise;
  };

  const [
    topicUpdateSubmit,
    { loading: updateLoading, error: updateError }
  ] = useMutation(UPDATE_TOPIC, {
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const calculateCreditsNeeded = () => {
    let creditsCounter = 0;
    cartTopics.forEach(topic => {
      topic.contentType > 0
        ? (creditsCounter += CONTENT_TYPES[topic.contentType - 1].credits)
        : null;
    });
    return creditsCounter;
  };

  const processTopic = async topic => {
    const topicInfo = await updateSubmitted(topic.id);

    handleTopicAlertEmail(topic.id);
  };

  const handleUpdateCredits = () => {
    const currentCredits = megaphoneUserInfo.entities[0].credits;
    const spentCredits = calculateCreditsNeeded();
    const remainingCredits = currentCredits - spentCredits;

    editEntity({
      id: megaphoneUserInfo.entities[0].id,
      credits: remainingCredits
    });
  };

  const verifyTypeSelectedForAllTopics = () => {
    return cartTopics.every(topic => topic.contentType !== 0);
  };
  //error handling in submitTopics flow is key
  //credits should be subtracted with each topic in case something goes wrong.
  const handleSubmitTopics = () => {
    if (verifyTypeSelectedForAllTopics()) {
      window.dataLayer.push({'event': "send_topics_to_F8"})
      cartTopics.forEach(topic => processTopic(topic));
      handleUpdateCredits();
      handleClearCart();
      setToggleCart(false);
    } else {
      alert("Please select a content type for each topic.");
    }
  };

  const handleRequestCredits = () => {
    window.dataLayer.push({'event': "request_credits"})
    editEntity({
      id: megaphoneUserInfo.entities[0]?.id,
      requestInProgress: true
    });
    handleCreditRequestAlertEmail();
  };

  const handleCreditRequestAlertEmail = () => {
    const url = `${process.env.MEGAPHONE_DB_URL}/credits_alert_emails?user_id=${megaphoneUserInfo.id}`;

    fetch(url, { method: "POST" })
      .then(error => console.log(error))
      .then(setShowAlert(true));
  };

  const setEntityName = () => {
    return megaphoneUserInfo.entities[0]?.name
      ? megaphoneUserInfo.entities[0]?.name
      : megaphoneUserInfo.entities[0]?.url;
  };

  return (
    <ul className="z-9 overflow-y-auto overflow-x-clip fixed top-0 -right-2 p-3 w-[100vw] sm:w-[55vh] md:w-[55vw] lg:w-[40vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
      <div className="flex w-full justify-between">
        <BasicAlert
          showBasicAlert={showAlert}
          setShowBasicAlert={setShowAlert}
          text="Request submitted. We'll be in touch soon."
        />
        <div></div>
        <div>
          <h1 className="w-full text-center font-extrabold text-3xl">
            Your Cart
          </h1>
          {cartTopics.length === 0 && (
            <p className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-5 font-bold self-center">
              Your cart is empty!
            </p>
          )}
        </div>
        <AiOutlineClose
          fontSize={28}
          className="text-white cursor-pointer mb-5"
          onClick={() => setToggleCart(false)}
        />
      </div>
      {/*This whole footer can be its own component*/}
      {cartTopics.length != 0 && (
        <>
          {cartTopics.map((topic, i) => (
            <CartTopic topic={topic} i={i} key={i} />
          ))}
          <p className="self-start font-bold">
            Total Topics in Cart: {cartTopics.length}{" "}
            {cartTopics.length > 1 ? "Topics" : "Topic"}
          </p>
          <p className="self-start font-bold">
            Total Units Needed: {calculateCreditsNeeded()} Units
          </p>
          {megaphoneUserInfo.entities[0]?.id ? (
            <div className="self-start">
              <p className="font-bold">
                Total Units Available:{" "}
                {megaphoneUserInfo.entities[0]?.credits || 0} Units
              </p>
              <p className="mt-5">Account: {setEntityName()}</p>
            </div>
          ) : (
            <div>
              <p>Total Units Available: N/A</p>
              <p>You are not currently associated with an account.</p>
            </div>
          )}

          <div className="flex justify-between w-full">
            <Button
              text={"Clear All"}
              handleClick={handleClearCart}
              customStyles={
                "text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              }
            />
            {megaphoneUserInfo.entities[0]?.requestInProgress ? (
              <div className="bg-[#2D104F] py-3 px-4 rounded-md cursor-not-allowed font-bold text-white">
                Units Requested
              </div>
            ) : (
              <CartButton
                verifySelections={verifyTypeSelectedForAllTopics}
                handleSubmitTopics={handleSubmitTopics}
                handleRequestCredits={handleRequestCredits}
                megaphoneUserInfo={megaphoneUserInfo}
                calculateCreditsNeeded={calculateCreditsNeeded}
              />
            )}
          </div>
        </>
      )}
    </ul>
  );
};

export default Cart;
