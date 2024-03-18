/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Comment = {
  __typename?: 'Comment';
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  post?: Maybe<Post>;
  postId: Scalars['ID']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type CreateCommentInput = {
  comment: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};

export type CreatePostInput = {
  aspectRatio: Scalars['String']['input'];
  caption?: InputMaybe<Scalars['String']['input']>;
  images: Scalars['String']['input'];
};

export type Follower = {
  __typename?: 'Follower';
  followersId: Scalars['ID']['output'];
  followingsId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  user?: Maybe<User>;
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  post?: Maybe<Post>;
  postId: Scalars['ID']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Response;
  createLike: Array<Maybe<Like>>;
  createPost: Response;
  followUser: Response;
};


export type MutationCreateCommentArgs = {
  comment: CreateCommentInput;
};


export type MutationCreateLikeArgs = {
  postId: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  post: CreatePostInput;
};


export type MutationFollowUserArgs = {
  userId: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  pageSize: Scalars['Int']['output'];
};

export type Post = {
  __typename?: 'Post';
  aspectRatio: Scalars['String']['output'];
  caption?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Array<Maybe<Comment>>>;
  commentCount?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  images: Scalars['String']['output'];
  lastLike?: Maybe<Scalars['String']['output']>;
  like?: Maybe<Array<Maybe<Like>>>;
  likeCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges?: Maybe<Array<Maybe<Post>>>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  comments: Array<Maybe<Comment>>;
  following: Array<Maybe<Follower>>;
  like: Array<Maybe<Like>>;
  likes: Array<Maybe<Like>>;
  post?: Maybe<Post>;
  posts: PostConnection;
  postsByUserId: Array<Maybe<Post>>;
  userById?: Maybe<User>;
  userByUsername?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryCommentsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLikeArgs = {
  postId: Scalars['String']['input'];
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryPostsByUserIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type Response = {
  __typename?: 'Response';
  message: Scalars['String']['output'];
  status: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  followingCount?: Maybe<Scalars['Int']['output']>;
  followings?: Maybe<Array<Maybe<Follower>>>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isOauth?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  post?: Maybe<Array<Maybe<Post>>>;
  postCount?: Maybe<Scalars['Int']['output']>;
  username: Scalars['String']['output'];
};

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', edges?: Array<{ __typename?: 'Post', id: string, caption?: string | null, aspectRatio: string, createdAt: any, images: string, commentCount?: number | null, likeCount?: number | null, lastLike?: string | null, like?: Array<{ __typename?: 'Like', postId: string, userId: string } | null> | null, user?: { __typename?: 'User', id: string, name: string, username: string, image?: string | null, postCount?: number | null, followingCount?: number | null, followersCount?: number | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', pageSize: number, currentPage: number, hasNextPage: boolean } } };

export type CreatePostMutationVariables = Exact<{
  post: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Response', status: number, message: string } };

export type CreateLikeMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type CreateLikeMutation = { __typename?: 'Mutation', createLike: Array<{ __typename?: 'Like', id: string, postId: string, userId: string, user?: { __typename?: 'User', username: string } | null } | null> };

export type GetLikeByPostIdQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetLikeByPostIdQuery = { __typename?: 'Query', like: Array<{ __typename?: 'Like', id: string, postId: string, userId: string, user?: { __typename?: 'User', username: string } | null } | null> };

export type CreateCommentMutationVariables = Exact<{
  comment: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Response', status: number, message: string } };

export type GetUserByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserByUsernameQuery = { __typename?: 'Query', userByUsername?: { __typename?: 'User', id: string, bio?: string | null, followersCount?: number | null, followingCount?: number | null, image?: string | null, name: string, postCount?: number | null, username: string, followers?: Array<{ __typename?: 'Follower', followingsId: string } | null> | null } | null };

export type GetUserByIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', post?: Array<{ __typename?: 'Post', images: string } | null> | null } | null };

export type GetPostsByUserIdQueryVariables = Exact<{
  postsByUserId: Scalars['ID']['input'];
}>;


export type GetPostsByUserIdQuery = { __typename?: 'Query', postsByUserId: Array<{ __typename?: 'Post', caption?: string | null, id: string, images: string, createdAt: any, likeCount?: number | null, commentCount?: number | null } | null> };

export type FollowUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser: { __typename?: 'Response', message: string, status: number } };

export type GetFollowingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowingQuery = { __typename?: 'Query', following: Array<{ __typename?: 'Follower', id: string, followingsId: string, followersId: string } | null> };

export type GetPostQueryVariables = Exact<{
  postId: Scalars['ID']['input'];
}>;


export type GetPostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, images: string, caption?: string | null, likeCount?: number | null, lastLike?: string | null, createdAt: any, user?: { __typename?: 'User', id: string, name: string, image?: string | null, username: string, followingCount?: number | null, followersCount?: number | null, postCount?: number | null } | null } | null };

export type GetPostCommentsQueryVariables = Exact<{
  commentsId: Scalars['ID']['input'];
}>;


export type GetPostCommentsQuery = { __typename?: 'Query', comments: Array<{ __typename?: 'Comment', id: string, comment: string, createdAt: any, user?: { __typename?: 'User', username: string, name: string, postCount?: number | null, image?: string | null, followingCount?: number | null, followersCount?: number | null } | null } | null> };


export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastLike"}},{"kind":"Field","name":{"kind":"Name","value":"like"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}},{"kind":"Field","name":{"kind":"Name","value":"followersCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"post"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"post"},"value":{"kind":"Variable","name":{"kind":"Name","value":"post"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const CreateLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLikeMutation, CreateLikeMutationVariables>;
export const GetLikeByPostIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLikeByPostId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"like"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetLikeByPostIdQuery, GetLikeByPostIdQueryVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"comment"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"comment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"comment"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const GetUserByUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserByUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userByUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"followersCount"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followingsId"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetPostsByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostsByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postsByUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postsByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postsByUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}}]}}]}}]} as unknown as DocumentNode<GetPostsByUserIdQuery, GetPostsByUserIdQueryVariables>;
export const FollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<FollowUserMutation, FollowUserMutationVariables>;
export const GetFollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"following"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"followingsId"}},{"kind":"Field","name":{"kind":"Name","value":"followersId"}}]}}]}}]} as unknown as DocumentNode<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastLike"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}},{"kind":"Field","name":{"kind":"Name","value":"followersCount"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>;
export const GetPostCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}},{"kind":"Field","name":{"kind":"Name","value":"followersCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostCommentsQuery, GetPostCommentsQueryVariables>;