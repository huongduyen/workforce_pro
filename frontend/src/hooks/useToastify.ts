import { toastifyService } from "../services/toastifyService";

/**
 * Custom hook for using toastify service
 * Usage: const toast = useToastify();
 *        toast.success("Operation completed!");
 */
export const useToastify = () => {
  return toastifyService;
};
