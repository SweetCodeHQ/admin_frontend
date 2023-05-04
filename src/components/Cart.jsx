import { useContext } from "react";
import { UserContext, CartContext } from "../context";
import { LaunchCartModalButton, Button, CartTopic } from "../components";
import { AiOutlineClose } from "react-icons/ai";
import { gql, useMutation } from "@apollo/client";

const UPDATE_TOPIC = gql`
  mutation UpdateSubmitted($id: ID!, $submitted: Boolean!) {
    updateTopic(input: { id: $id, submitted: $submitted }) {
      id
      submitted
      text
      abstract {
        id
        text
      }
    }
  }
`;

const Cart = ({ setToggleCart }) => {
  const { handleTopicAlertEmail, handleClearCart, cartTopics } = useContext(
    CartContext
  );

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

  const processTopics = async topic => {
    let promise;
    let topicInfo;

    topicInfo = await updateSubmitted(topic.id);
    const abstractText = topicInfo.data.updateTopic.abstract?.text;

    handleTopicAlertEmail(topic.id);
  };

  const handleSubmitTopics = () => {
    cartTopics.forEach(topic => processTopics(topic));
    handleClearCart();
    setToggleCart(false);
  };

  return (
    <ul className="z-10 fixed top-0 -right-2 p-3 w-[75vw] md:w-[35vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
      <div className="flex justify-between w-full">
        <div></div>
        <h1 className="font-extrabold text-2xl underline underline-offset-2">
          Your Cart
        </h1>
        <AiOutlineClose
          fontSize={28}
          className="text-white cursor-pointer mb-5"
          onClick={() => setToggleCart(false)}
        />
      </div>
      {cartTopics.length === 0 && (
        <p className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold self-center">
          Your cart is empty!
        </p>
      )}
      {cartTopics.length != 0 && (
        <>
          {cartTopics.map((topic, i) => (
            <CartTopic text={topic.text} i={i} key={i} />
          ))}
          <p className="self-center font-bold">
            You Have {cartTopics.length}{" "}
            {cartTopics.length > 1 ? "Topics" : "Topic"} in Your Cart
          </p>
          <div className="flex justify-between w-full">
            <Button
              text={"Clear All"}
              handleClick={handleClearCart}
              customStyles={
                "text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
              }
            />
            <LaunchCartModalButton handleSubmitTopics={handleSubmitTopics} />
          </div>
        </>
      )}
    </ul>
  );
};

export default Cart;
