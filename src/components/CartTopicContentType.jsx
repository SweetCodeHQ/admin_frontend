import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TOPIC_TYPE } from '../graphql/mutations';
import { FlyoutMenu } from '.';
import { CartContext, UserContext } from '../context';
import { CONTENT_TYPES } from '../constants/contentTypes';
import { callMutation } from '../utils/callMutation';

const CartTopicContentType = ({ topicId, contentType, topicIndex }) => {
  const { updateCartTopic } = useContext(CartContext);
  const { megaphoneUserInfo } = useContext(UserContext)

  const handleChangeContentType = async (typeIndex) => {
    const type = typeIndex + 1;
    try {
      await callMutation({ id: topicId, contentType: type }, updateTopicType)
      updateCartTopic(topicIndex, type);
    } catch (error) {
      console.log(error);
      alert('Sorry, I goofed! Please try again.');
    }
  };

  const [updateTopicType, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TOPIC_TYPE, {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: megaphoneUserInfo?.id } },
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
