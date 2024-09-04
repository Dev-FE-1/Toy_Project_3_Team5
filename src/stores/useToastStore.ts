import { create } from 'zustand';
import { ToastStatusType } from '@/components/Toast';

interface ToastState {
  isToastOn: boolean;
  status: ToastStatusType;
  toastMsg: string;
  toastOn: (msg: string, status?: ToastStatusType) => void;
  toastOff: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isToastOn: false,
  toastMsg: '',
  status: 'success',

  toastOn: (msg: string, status: ToastStatusType = 'success') => {
    set({ isToastOn: true, toastMsg: msg, status });
  },
  toastOff: () => {
    set({ isToastOn: false, toastMsg: '', status: 'success' });
  },
}));
