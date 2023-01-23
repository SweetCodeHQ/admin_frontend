import { useState, useEffect, forwardRef, useRef } from "react";
import { Loader } from "../components";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_TOPIC = gql`
  query topic($id: ID!) {
    topic(id: $id) {
      id
      text
      abstract {
        id
        text
      }
    }
  }
`;

const CREATE_ABSTRACT = gql`
  mutation CreateAbstract($topicId: ID!, $text: String!) {
    createAbstract(input: { topicId: $topicId, text: $text }) {
      id
      text
    }
  }
`;

const DESTROY_ABSTRACT = gql`
  mutation DestroyAbstract($id: ID!) {
    destroyAbstract(input: { id: $id }) {
      id
    }
  }
`;

const UPDATE_ABSTRACT = gql`
  mutation UpdateAbstract($id: ID!, $text: String!) {
    updateAbstract(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

const Button = ({ text, handleClick }) => {
  return (
    <button
      className="text-[#2D104F] font-bold bg-white rounded-full ml-5 md:ml-0 text-center text-base pr-3 pl-3 pt-1 mb-4 pb-1 mt-3 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

const TopicAbstractMenu = forwardRef(
  ({ topic, handleToggleAbstract }, abstractRef) => {
    const { data: topicData, refetch: refetchTopic } = useQuery(GET_TOPIC, {
      variables: { id: topic.id },
      onError: error => console.log(error)
    });

    const [localTopic, setLocalTopic] = useState(topic);

    const [abstract, setAbstract] = useState(topic.abstract);

    const [formText, setFormText] = useState(() => {
      const text = topic.abstract?.text;
      return text || "";
    });

    useEffect(() => {
      setFormText(abstract?.text);
    }, [abstract]);

    const [isLoading, setIsLoading] = useState(false);

    const textRef = useRef();
    const clickRef = useRef();

    const handleChange = (e, name) => {
      setFormText(prevState => e.target.value);
    };

    const [abstractMutationData, { error: abstractError }] = useMutation(
      CREATE_ABSTRACT,
      {
        onCompleted: data => setAbstract(data.createAbstract),
        onError: error => console.log(error)
      }
    );

    const createAbstract = async (topicId, text) => {
      const input = { topicId: topic.id, text: text };
      await abstractMutationData({ variables: input });
    };

    const [abstractDestroyData, { error: abstractDestroyError }] = useMutation(
      DESTROY_ABSTRACT,
      {
        onError: error => console.log(error)
      }
    );

    const destroyAbstract = async () => {
      const input = { id: abstract.id };
      const destruction = await abstractDestroyData({ variables: input });
    };

    const [abstractUpdateData, { error: abstractUpdateError }] = useMutation(
      UPDATE_ABSTRACT,
      {
        onCompleted: data => console.log("Successfully Updated"),
        onError: error => console.log(error)
      }
    );

    const updateAbstract = () => {
      const input = { id: topic.abstract.id, text: formText };
      abstractUpdateData({ variables: input });
    };

    const generateAbstract = async () => {
      let instract;

      const handleResponse = response => {
        instract = response.data.attributes.text.split("\n")[2];
      };

      const url = `${process.env.AI_API_URL}/api/v1/abstracts?`;

      const fullUrl = `${url}topic="${topic.text}"`;

      const response = await fetch(fullUrl)
        .then(response => response.json())
        .then(response => handleResponse(response))
        .then(error => console.log(error));

      return instract;
    };

    const handleCreateAbstract = async () => {
      setIsLoading(true);
      const abstract = await generateAbstract();

      const newInstract = await createAbstract(topic.id, abstract);
      refetchTopic();
      setIsLoading(false);
    };

    const handleRegenerateAbstract = async () => {
      setIsLoading(true);
      const destruction = await destroyAbstract();
      setFormText(null);
      const newAbstract = await handleCreateAbstract();
      setIsLoading(false);
    };

    const handleSaveAbstract = () => {
      if (formText && formText !== abstract.text) updateAbstract();
      setAbstract(prev => {
        return {
          ...prev,
          text: formText
        };
      });
      refetchTopic();
    };

    useEffect(() => {
      const handleClick = event => {
        if (textRef.current && !textRef.current.contains(event.target)) {
          handleSaveAbstract();
        }
      };
      document.addEventListener("click", handleClick, true);
      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    }, [textRef, formText, abstract]);

    useEffect(() => {
      if (textRef && textRef.current) {
        textRef.current.style.height = "auto";
        textRef.current.style.height = `${textRef.current.scrollHeight}px`;
      }
    }, [textRef, formText]);

    return (
      <div className="flex flex-col text-white" ref={abstractRef}>
        <div className="flex">
          <h1 className="self-center text-xl font-bold mr-10">
            Abstract (Beta)
          </h1>
          <Button
            text={formText ? "Regenerate" : "Generate"}
            handleClick={
              formText ? handleRegenerateAbstract : handleCreateAbstract
            }
          />
        </div>
        {isLoading ? <Loader /> : null}
        {/*{formText ? (
            isLoading ? (
              <Loader />
            ) : (
              <Button
                text="REGENERATE"
                handleClick={handleRegenerateAbstract}
              />
            )
          ) : isLoading ? (
            <Loader />
          ) : (
            <Button handleClick={handleCreateAbstract} text="GENERATE" />
          )}*/}
        {formText && !isLoading && (
          <textarea
            ref={textRef}
            placeholder="Abstract Text"
            name="abstractText"
            type="text"
            value={formText}
            onChange={e => handleChange(e, name)}
            className={
              "my-2 w-full rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-none text-sm shadow-inner shadow-lg resize-none opacity-70"
            }
          />
        )}
      </div>
    );
  }
);

export default TopicAbstractMenu;
