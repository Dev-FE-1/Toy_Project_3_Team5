import { create } from 'zustand';

type ModalType = 'confirm' | 'delete';

interface ModalData {
  type: ModalType;
  title: string;
  content: string;
  onAction: () => void;
}

interface ModalStore {
  isOpen: boolean;
  modalData: ModalData | null;
  openModal: (data: ModalData) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalData: null,
  openModal: (data: ModalData) => set({ isOpen: true, modalData: data }),
  closeModal: () => set({ isOpen: false, modalData: null }),
}));

export default useModalStore;
