import { GetUserByUsernameQuery } from "@/lib/graphql/__generated__/graphql";
import { create } from "zustand";

type UserProfileStore = {
  userData: GetUserByUsernameQuery | undefined;
  setUserData: (userData: GetUserByUsernameQuery | undefined) => void;
};

const useUserProfile = create<UserProfileStore>((set) => ({
  userData: undefined,
  setUserData: (userData) => set({ userData }),
}));

export default useUserProfile;
