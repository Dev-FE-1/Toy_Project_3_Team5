import { useToastStore } from '@/stores/useToastStore';

const useToast = () => {
  const { isToastOn, toastMsg, toastOn, toastOff } = useToastStore();

  const handler = {
    toastTrigger: (msg: string) => {
      toastOn(msg);
    },
    onClose: () => {
      toastOff();
    },
  };

  return {
    isToastOn,
    toastMsg,
    toastTrigger: handler.toastTrigger,
    onClose: handler.onClose,
  };
};

export default useToast;
