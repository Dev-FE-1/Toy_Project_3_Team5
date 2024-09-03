import { create } from 'zustand';

interface ToastState {
  isToastOn: boolean;
  toastMsg: string;
  toastOn: (msg: string) => void;
  toastOff: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isToastOn: false,
  toastMsg: '',

  toastOn: (msg: string) => {
    set({ isToastOn: true, toastMsg: msg });
  },
  toastOff: () => {
    set({ isToastOn: false, toastMsg: '' });
  },
}));
