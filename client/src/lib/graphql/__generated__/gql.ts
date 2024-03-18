/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetPosts($limit: Int!, $page: Int!) {\n    posts(limit: $limit, page: $page) {\n      edges {\n        id\n        caption\n        aspectRatio\n        createdAt\n        images\n        commentCount\n        likeCount\n        lastLike\n        like {\n          postId\n          userId\n        }\n        user {\n          id\n          name\n          username\n          image\n          postCount\n          followingCount\n          followersCount\n        }\n      }\n      pageInfo {\n        pageSize\n        currentPage\n        hasNextPage\n      }\n    }\n  }\n": types.GetPostsDocument,
    "\n  mutation CreatePost($post: CreatePostInput!) {\n    createPost(post: $post) {\n      status\n      message\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation CreateLike($postId: String!) {\n    createLike(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n": types.CreateLikeDocument,
    "\n  query GetLikeByPostId($postId: String!) {\n    like(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n": types.GetLikeByPostIdDocument,
    "\n  mutation CreateComment($comment: CreateCommentInput!) {\n    createComment(comment: $comment) {\n      status\n      message\n    }\n  }\n": types.CreateCommentDocument,
    "\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      id\n      bio\n      followersCount\n      followingCount\n      image\n      name\n      postCount\n      username\n      followers {\n        followingsId\n      }\n    }\n  }\n": types.GetUserByUsernameDocument,
    "\n  query GetUserById($userId: ID!) {\n    userById(id: $userId) {\n      post {\n        images\n      }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  query GetPostsByUserId($postsByUserId: ID!) {\n    postsByUserId(id: $postsByUserId) {\n      caption\n      id\n      images\n      createdAt\n      likeCount\n      commentCount\n    }\n  }\n": types.GetPostsByUserIdDocument,
    "\n  mutation FollowUser($userId: String!) {\n    followUser(userId: $userId) {\n      message\n      status\n    }\n  }\n": types.FollowUserDocument,
    "\n  query GetFollowing {\n    following {\n      id\n      followingsId\n      followersId\n    }\n  }\n": types.GetFollowingDocument,
    "\n  query GetPost($postId: ID!) {\n    post(id: $postId) {\n      id\n      images\n      caption\n      likeCount\n      lastLike\n      createdAt\n      user {\n        id\n        name\n        image\n        username\n        followingCount\n        followersCount\n        postCount\n      }\n    }\n  }\n": types.GetPostDocument,
    "\n  query GetPostComments($commentsId: ID!) {\n    comments(id: $commentsId) {\n      id\n      comment\n      createdAt\n      user {\n        username\n        name\n        postCount\n        image\n        followingCount\n        followersCount\n      }\n    }\n  }\n": types.GetPostCommentsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPosts($limit: Int!, $page: Int!) {\n    posts(limit: $limit, page: $page) {\n      edges {\n        id\n        caption\n        aspectRatio\n        createdAt\n        images\n        commentCount\n        likeCount\n        lastLike\n        like {\n          postId\n          userId\n        }\n        user {\n          id\n          name\n          username\n          image\n          postCount\n          followingCount\n          followersCount\n        }\n      }\n      pageInfo {\n        pageSize\n        currentPage\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($limit: Int!, $page: Int!) {\n    posts(limit: $limit, page: $page) {\n      edges {\n        id\n        caption\n        aspectRatio\n        createdAt\n        images\n        commentCount\n        likeCount\n        lastLike\n        like {\n          postId\n          userId\n        }\n        user {\n          id\n          name\n          username\n          image\n          postCount\n          followingCount\n          followersCount\n        }\n      }\n      pageInfo {\n        pageSize\n        currentPage\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePost($post: CreatePostInput!) {\n    createPost(post: $post) {\n      status\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($post: CreatePostInput!) {\n    createPost(post: $post) {\n      status\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateLike($postId: String!) {\n    createLike(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLike($postId: String!) {\n    createLike(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLikeByPostId($postId: String!) {\n    like(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetLikeByPostId($postId: String!) {\n    like(postId: $postId) {\n      id\n      postId\n      userId\n      user {\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateComment($comment: CreateCommentInput!) {\n    createComment(comment: $comment) {\n      status\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($comment: CreateCommentInput!) {\n    createComment(comment: $comment) {\n      status\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      id\n      bio\n      followersCount\n      followingCount\n      image\n      name\n      postCount\n      username\n      followers {\n        followingsId\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      id\n      bio\n      followersCount\n      followingCount\n      image\n      name\n      postCount\n      username\n      followers {\n        followingsId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserById($userId: ID!) {\n    userById(id: $userId) {\n      post {\n        images\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserById($userId: ID!) {\n    userById(id: $userId) {\n      post {\n        images\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPostsByUserId($postsByUserId: ID!) {\n    postsByUserId(id: $postsByUserId) {\n      caption\n      id\n      images\n      createdAt\n      likeCount\n      commentCount\n    }\n  }\n"): (typeof documents)["\n  query GetPostsByUserId($postsByUserId: ID!) {\n    postsByUserId(id: $postsByUserId) {\n      caption\n      id\n      images\n      createdAt\n      likeCount\n      commentCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation FollowUser($userId: String!) {\n    followUser(userId: $userId) {\n      message\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation FollowUser($userId: String!) {\n    followUser(userId: $userId) {\n      message\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFollowing {\n    following {\n      id\n      followingsId\n      followersId\n    }\n  }\n"): (typeof documents)["\n  query GetFollowing {\n    following {\n      id\n      followingsId\n      followersId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPost($postId: ID!) {\n    post(id: $postId) {\n      id\n      images\n      caption\n      likeCount\n      lastLike\n      createdAt\n      user {\n        id\n        name\n        image\n        username\n        followingCount\n        followersCount\n        postCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPost($postId: ID!) {\n    post(id: $postId) {\n      id\n      images\n      caption\n      likeCount\n      lastLike\n      createdAt\n      user {\n        id\n        name\n        image\n        username\n        followingCount\n        followersCount\n        postCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPostComments($commentsId: ID!) {\n    comments(id: $commentsId) {\n      id\n      comment\n      createdAt\n      user {\n        username\n        name\n        postCount\n        image\n        followingCount\n        followersCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPostComments($commentsId: ID!) {\n    comments(id: $commentsId) {\n      id\n      comment\n      createdAt\n      user {\n        username\n        name\n        postCount\n        image\n        followingCount\n        followersCount\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;