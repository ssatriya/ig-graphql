import { gql } from "../__generated__";

export const GET_POSTS = gql(/* GraphQL */ `
  query GetPosts($limit: Int!, $page: Int!) {
    posts(limit: $limit, page: $page) {
      edges {
        id
        caption
        aspectRatio
        createdAt
        images
        commentCount
        likeCount
        lastLike
        like {
          postId
          userId
        }
        user {
          id
          name
          username
          image
          postCount
          followingCount
          followersCount
        }
      }
      pageInfo {
        pageSize
        currentPage
        hasNextPage
      }
    }
  }
`);

export const CREATE_POST = gql(/* GraphQL */ `
  mutation CreatePost($post: CreatePostInput!) {
    createPost(post: $post) {
      status
      message
    }
  }
`);

export const CREATE_LIKE = gql(/* GraphQL */ `
  mutation CreateLike($postId: String!) {
    createLike(postId: $postId) {
      id
      postId
      userId
      user {
        username
      }
    }
  }
`);

export const GET_LIKES = gql(/* GraphQL */ `
  query GetLikeByPostId($postId: String!) {
    like(postId: $postId) {
      id
      postId
      userId
      user {
        username
      }
    }
  }
`);

export const CREATE_COMMENT = gql(/* GraphQL */ `
  mutation CreateComment($comment: CreateCommentInput!) {
    createComment(comment: $comment) {
      status
      message
    }
  }
`);

export const GET_USER_BY_USERNAME = gql(/* GraphQL */ `
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      bio
      followersCount
      followingCount
      image
      name
      postCount
      username
    }
  }
`);

export const GET_USER_BY_ID = gql(/* GraphQL */ `
  query GetUserById($userId: ID!) {
    userById(id: $userId) {
      post {
        images
      }
    }
  }
`);

export const GET_POSTS_BY_USER_ID = gql(/* GraphQL */ `
  query GetPostsByUserId($postsByUserId: ID!) {
    postsByUserId(id: $postsByUserId) {
      caption
      id
      images
      createdAt
      likeCount
      commentCount
    }
  }
`);
