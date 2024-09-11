import { ToastStatusType } from '@/components/Toast';
import { useToastStore } from '@/stores/useToastStore';

const useToast = () => {
  const { isToastOn, toastMsg, toastOn, toastOff, status } = useToastStore();

  const handler = {
    toastTrigger: (msg: string, status: ToastStatusType = 'success') => {
      toastOn(msg, status);
    },
    onClose: () => {
      toastOff();
    },
  };

  return {
    isToastOn,
    toastMsg,
    status,
    toastTrigger: handler.toastTrigger,
    onClose: handler.onClose,
  };
};

export default useToast;
