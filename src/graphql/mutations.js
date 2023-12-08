import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($email: String!) {
    createUser(input: { email: $email }) {
      id
      email
      isAdmin
      loginCount
      clickedGenerateCount
      topicCount
      industry
      onboarded
      acceptedEulaOn
      acceptedCookiesOn
      acceptedPrivacyOn
      sawBannerOn
      entities {
        id
        name
        url
        credits
        requestInProgress
      }
    }
  }
`;
export const UPDATE_LOGIN_COUNT = gql`
  mutation UpdateLoginCount($id: ID!) {
    updateUser(input: { id: $id, loginCount: 1 }) {
      id
      loginCount
    }
  }
`;

export const UPDATE_CLICKED_GENERATE_COUNT = gql`
  mutation UpdateClickedGenerateCount {
    updateUser(input: {clickedGenerateCount: 1 }) {
      id
      clickedGenerateCount
    }
  }
`;

export const UPDATE_ADMIN_STATUS = gql`
  mutation updateUser($id: ID!, $isAdmin: Boolean, $isBlocked: Boolean) {
    updateUser(input: { id: $id, isAdmin: $isAdmin, isBlocked: $isBlocked }) {
      id
      email
      isAdmin
      isBlocked
    }
  }
`;

export const UPDATE_INDUSTRY = gql`
  mutation updateIndustry($industry: Int!) {
    updateUser(input: {industry: $industry }) {
      id
      email
      industry
    }
  }
`;

export const UPDATE_ONBOARDED = gql`
  mutation UpdateOnboarded {
    updateUser(input: { onboarded: true }) {
      id
      onboarded
    }
  }
`;

export const CREATE_USER_ENTITY = gql`
  mutation CreateUserEntity($userId: ID!, $entityId: ID!) {
    createUserEntity(input: { userId: $userId, entityId: $entityId }) {
      id
    }
  }
`;

export const CREATE_ABSTRACT = gql`
  mutation CreateAbstract($topicId: ID!, $text: String!) {
    createAbstract(input: { topicId: $topicId, text: $text }) {
      id
      text
    }
  }
`;

export const DESTROY_ABSTRACT = gql`
  mutation DestroyAbstract($id: ID!) {
    destroyAbstract(input: { id: $id }) {
      id
    }
  }
`;

export const CREATE_KEYWORD = gql`
  mutation CreateKeyword($word: String!) {
    createKeyword(input: { word: $word }) {
      id
      word
    }
  }
`;

export const UPDATE_KEYWORD = gql`
  mutation UpdateKeyword($word: String!) {
    updateKeyword(input: { word: $word }) {
      id
      word
    }
  }
`;

export const CREATE_USER_KEYWORD = gql`
  mutation CreateUserKeyword($keywordId: ID!) {
    createUserKeyword(input: { keywordId: $keywordId }) {
      id
    }
  }
`;

export const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $link: String, $text: String) {
    updateBanner(input: { id: $id, link: $link, text: $text }) {
      id
      text
      link
    }
  }
`;

export const CREATE_TOPIC = gql`
  mutation CreateTopic($text: String!) {
    createTopic(input: {text: $text }) {
      id
      text
    }
  }
`;

export const SUBMIT_TOPIC = gql`
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

export const UPDATE_TOPIC_TEXT = gql`
  mutation UpdateTopicText($id: ID!, $text: String!) {
    updateTopic(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

export const UPDATE_TOPIC_TYPE = gql`
  mutation UpdateType($id: ID!, $contentType: Int!) {
    updateTopic(input: { id: $id, contentType: $contentType }) {
      id
      text
      contentType
    }
  }
`;

export const DESTROY_TOPIC = gql`
  mutation ($id: ID!) {
    destroyTopic(input: { id: $id }) {
      id
    }
  }
`;

export const CREATE_TOPIC_KEYWORD = gql`
  mutation CreateTopicKeyword($topicId: ID!, $keywordId: ID!) {
    createTopicKeyword(input: { topicId: $topicId, keywordId: $keywordId }) {
      id
    }
  }
`;

export const UPDATE_ABSTRACT = gql`
  mutation UpdateAbstract($id: ID!, $text: String!) {
    updateAbstract(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

export const UPDATE_USER_BANNER_DATE = gql`
  mutation UpdateUserBannerDate(
    $id: ID!
    $sawBannerOn: ISO8601DateTime
    $acceptedPrivacyOn: ISO8601DateTime
  ) {
    updateUser(
      input: {
        id: $id
        sawBannerOn: $sawBannerOn
        acceptedPrivacyOn: $acceptedPrivacyOn
      }
    ) {
      id
      sawBannerOn
      acceptedPrivacyOn
    }
  }
`;

export const CREATE_ENTITY = gql`
  mutation createEntity($name: String, $url: String!) {
    createEntity(input: { name: $name, url: $url }) {
      id
      name
      url
    }
  }
`;

export const EDIT_ENTITY = gql`
  mutation EditEntity(
    $id: ID!
    $name: String
    $url: String
    $credits: Float
    $requestInProgress: Boolean
  ) {
    updateEntity(
      input: {
        id: $id
        name: $name
        url: $url
        credits: $credits
        requestInProgress: $requestInProgress
      }
    ) {
      id
      name
      url
      credits
      requestInProgress
    }
  }
`;

