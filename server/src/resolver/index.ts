import { and, count, eq } from "drizzle-orm";

import db from "../lib/db/index.js";
import { Resolvers } from "../../types.js";
import { comments, followers, likes, posts } from "../lib/db/schema.js";

export const resolvers: Resolvers = {
  Query: {
    users: async () => {
      const users = await db.query.users.findMany();
      return users;
    },
    posts: async (_, { page, limit }, { session }) => {
      const posts = await db.query.posts.findMany({
        orderBy: (posts, { desc }) => desc(posts.createdAt),
        offset: (page - 1) * limit,
        limit: limit,
      });

      const allPosts = await db.query.posts.findMany();
      return {
        edges: posts,
        pageInfo: {
          currentPage: page,
          hasNextPage: allPosts.length > limit,
          pageSize: limit,
        },
      };
    },
    postsByUserId: async (_, { id }) => {
      const posts = await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.userId, id),
      });

      return posts;
    },
    userById: async (_, { id }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });

      if (!user) {
        return null;
      }

      return user;
    },
    userByUsername: async (_, { username }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });

      if (!user) {
        return null;
      }

      return user;
    },
    post: async (_, { id }) => {
      const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, id),
      });

      if (!post) {
        return null;
      }

      return post;
    },
    comments: async (_, { id }) => {
      const comments = await db.query.comments.findMany({
        where: (comments, { eq }) => eq(comments.postId, id),
      });

      return comments;
    },
    likes: async () => {
      const likes = await db.query.likes.findMany();

      return likes;
    },
    like: async (_, { postId }) => {
      const like = await db.query.likes.findMany({
        where: (likes, { eq }) => eq(likes.postId, postId),
      });

      return like;
    },
  },
  Comment: {
    post: async (parent) => {
      const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, parent.postId),
      });

      if (!post) {
        return null;
      }
      return post;
    },
    user: async (parent) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, parent.userId),
      });

      if (!user) {
        return null;
      }

      return user;
    },
  },
  Post: {
    user: async (parent, _, { session }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, parent.userId),
      });

      if (!user) {
        return null;
      }

      return user;
    },
    comment: async (parent) => {
      const comments = await db.query.comments.findMany({
        where: (comments, { eq }) => eq(comments.postId, parent.id),
      });

      return comments;
    },
    like: async (parent) => {
      const likes = await db.query.likes.findMany({
        where: (likes, { eq }) => eq(likes.postId, parent.id),
      });

      return likes;
    },
    commentCount: async (parent) => {
      const [commentCount] = await db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.postId, parent.id));

      return commentCount.count;
    },
    likeCount: async (parent) => {
      const [likeCount] = await db
        .select({ count: count() })
        .from(likes)
        .where(eq(likes.postId, parent.id));

      return likeCount.count;
    },
    lastLike: async (parent) => {
      const lastLike = await db.query.likes.findFirst({
        with: {
          user: true,
        },
        where: (likes, { eq }) => eq(likes.postId, parent.id),
        orderBy: (likes, { desc }) => desc(likes.createdAt),
      });

      if (!lastLike) return null;

      return lastLike.user.username;
    },
    // isLiked: async (parent, _, { session }) => {
    //   if (!session.user) {
    //     return false;
    //   }
    //   const likes = await db.query.likes.findFirst({
    //     where: (likes, { eq, and }) =>
    //       and(eq(likes.postId, parent.id), eq(likes.userId, session.user?.id)),
    //   });

    //   if (likes) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
  User: {
    post: async (parent) => {
      const posts = await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.userId, parent.id),
      });

      if (!posts) {
        return null;
      }

      return posts;
    },
    followers: async (parent) => {
      const followers = await db.query.followers.findMany({
        where: (followers, { eq }) => eq(followers.followersId, parent.id),
      });

      return followers;
    },
    followings: async (parent) => {
      const followings = await db.query.followers.findMany({
        where: (followers, { eq }) => eq(followers.followingsId, parent.id),
      });

      return followings;
    },
    postCount: async (parent) => {
      const [postCounts] = await db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.userId, parent.id));

      return postCounts.count;
    },
    followingCount: async (parent) => {
      const [followingCount] = await db
        .select({ count: count() })
        .from(followers)
        .where(eq(followers.followingsId, parent.id));

      return followingCount.count;
    },
    followersCount: async (parent) => {
      const [followersCount] = await db
        .select({ count: count() })
        .from(followers)
        .where(eq(followers.followersId, parent.id));

      return followersCount.count;
    },
  },
  Like: {
    post: async (parent) => {
      const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, parent.postId),
      });

      if (!post) {
        return null;
      }

      return post;
    },
    user: async (parent) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, parent.userId),
      });

      if (!user) {
        return null;
      }

      return user;
    },
  },
  Follower: {
    user: async (parent, _, { session }) => {
      const users = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, parent.followersId),
      });

      if (!users) {
        return null;
      }

      return users;
    },
  },
  Mutation: {
    createPost: async (
      _,
      { post: { images, aspectRatio, caption } },
      { session }
    ) => {
      await db.insert(posts).values({
        userId: session.user.id,
        images,
        caption,
        aspectRatio,
      });

      return { message: "Post created", status: 201 };
    },
    createLike: async (_, { postId }, { session }) => {
      const isLiked = await db.query.likes.findFirst({
        where: (likes, { eq, and }) =>
          and(eq(likes.postId, postId), eq(likes.userId, session.user.id)),
      });

      if (!isLiked) {
        await db.insert(likes).values({ postId, userId: session.user.id });

        const allLikes = await db.query.likes.findMany({
          where: (likes, { eq }) => eq(likes.postId, postId),
        });

        return allLikes;
      }

      await db
        .delete(likes)
        .where(
          and(eq(likes.postId, postId), eq(likes.userId, session.user.id))
        );

      const allLikes = await db.query.likes.findMany({
        where: (likes, { eq }) => eq(likes.postId, postId),
      });

      return allLikes;
    },
    createComment: async (_, { comment: { comment, postId } }, { session }) => {
      await db.insert(comments).values({
        comment,
        postId,
        userId: session.user.id,
      });

      return { message: "Comment created", status: 201 };
    },
  },
};
