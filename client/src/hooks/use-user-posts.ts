import { GetPostsByUserIdQuery } from "@/lib/graphql/__generated__/graphql";
import { create } from "zustand";

type UserPostsStore = {
  userPosts: GetPostsByUserIdQuery | undefined;
  setUserPosts: (userPosts: GetPostsByUserIdQuery | undefined) => void;
};

const useUserPosts = create<UserPostsStore>((set) => ({
  userPosts: undefined,
  setUserPosts: (userPosts) => set({ userPosts }),
}));

export default useUserPosts;
