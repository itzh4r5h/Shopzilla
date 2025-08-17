import { useEffect } from "react";
import { toast } from "react-toastify";

/**
 * Generic hook for handling toast notifications.
 *
 * @param {string | null} params.error - Error message from slice
 * @param {boolean} params.success - Success flag from slice
 * @param {string | null} params.message - Success message from slice
 * @param {function} params.clearError - Action creator to clear error
 * @param {function} params.clearMessage - Action creator to clear message
 * @param {function} dispatch - Redux dispatch function
 */
export const useToastNotify = (
  error,
  success,
  message,
  clearError,
  clearMessage,
  dispatch
) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);
};
