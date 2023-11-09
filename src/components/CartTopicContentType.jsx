import { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FlyoutMenu } from '.';
import { CartContext } from '../context';
import { CONTENT_TYPES } from '../constants/contentTypes';

const UPDATE_TOPIC_TYPE = gql`
  mutation UpdateType($id: ID!, $contentType: Int!) {
    updateTopic(input: { id: $id, contentType: $contentType }) {
      id
      text
      contentType
    }
  }
`;

const CartTopicContentType = ({ topicId, contentType, topicIndex }) => {
  const { updateCartTopic } = useContext(CartContext);

  const handleChangeContentType = async (typeIndex) => {
    const type = typeIndex + 1;
    try {
      const promise = await updateTopicType(topicId, type);
      updateCartTopic(topicIndex, type);
    } catch (error) {
      console.log(error);
      alert('Sorry, I goofed! Please try again.');
    }
  };

  const updateTopicType = async (id, type) => {
    let promise;
    const input = { contentType: type, id };
    promise = await topicUpdateTypeData({ variables: input });
    return promise;
  };

  const [topicUpdateTypeData, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TOPIC_TYPE, {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
      onError: (error) => console.log(error),
      onCompleted: (data) => console.log(data),
    });

  return (
    <div className="flex font-bold justify-between">
      <FlyoutMenu
        options={CONTENT_TYPES}
        menuState={CONTENT_TYPES[contentType - 1]?.name.toUpperCase()}
        handleState={handleChangeContentType}
        menuName="Content Type"
      />
      {contentType === 0 ? null : (
        <h4>
          {CONTENT_TYPES[contentType - 1].credits}{' '}
          {CONTENT_TYPES[contentType - 1].credits > 1 ? 'Units' : 'Unit'}
        </h4>
      )}
    </div>
  );
};

export default CartTopicContentType;
