import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query userByEmail($email: String) {
    user(email: $email) {
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

export const GET_PAGINATED_USERS = gql`
  query UsersConnection($after: String, $before: String, $last: Int) {
    usersConnection(after: $after, before: $before, last: $last) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          email
          isBlocked
          topicCount
          loginCount
          clickedGenerateCount
          createdAt
          isAdmin
        }
      }
    }
  }
`;

export const GET_USER_TOPICS = gql`
  query UserTopics {
    user {
      id
      topics {
        id
        text
        submitted
        contentType
        createdAt
      }
    }
  }
`;

export const GET_ENTITY = gql`
  query entityByUrl($url: String!) {
    entity(url: $url) {
      id
      url
      credits
      requestInProgress
    }
  }
`;

export const GET_PAGINATED_ENTITIES = gql`
  query EntitiesConnection($after: String, $before: String, $last: Int) {
    entitiesConnection(after: $after, before: $before, last: $last) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          url
          userCount
          topicCount
          credits
        }
      }
    }
  }
`;

export const GET_BANNERS = gql`
  query Banners {
    banners {
      id
      purpose
      text
      link
      updatedAt
    }
  }
`;

export const GET_TOPIC = gql`
  query topic($id: ID!) {
    topic(id: $id) {
      id
      text
      submitted
      contentType
      createdAt
      abstract {
        id
        text
      }
      keywords {
        word
      }
    }
  }
`;



