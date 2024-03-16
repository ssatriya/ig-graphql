import { create } from "zustand";

type ContentLoadingStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const useContentLoading = create<ContentLoadingStore>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
export default useContentLoading;
