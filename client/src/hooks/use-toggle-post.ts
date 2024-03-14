import { create } from "zustand";

type TogglePostStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useTogglePost = create<TogglePostStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
