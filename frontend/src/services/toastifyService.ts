import { toast, type ToastOptions } from "react-toastify";

// Default toast options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

class ToastifyService {
  /**
   * Show success toast message
   * @param message - The message to display
   * @param options - Optional toast options
   */
  success(message: string, options?: ToastOptions): void {
    toast.success(message, { ...defaultOptions, ...options });
  }

  /**
   * Show error toast message
   * @param message - The message to display
   * @param options - Optional toast options
   */
  error(message: string, options?: ToastOptions): void {
    toast.error(message, { ...defaultOptions, ...options });
  }

  /**
   * Show warning toast message
   * @param message - The message to display
   * @param options - Optional toast options
   */
  warning(message: string, options?: ToastOptions): void {
    toast.warning(message, { ...defaultOptions, ...options });
  }

  /**
   * Show info toast message
   * @param message - The message to display
   * @param options - Optional toast options
   */
  info(message: string, options?: ToastOptions): void {
    toast.info(message, { ...defaultOptions, ...options });
  }

  /**
   * Show loading toast message
   * @param message - The message to display
   * @param options - Optional toast options
   * @returns Toast ID for updating later
   */
  loading(message: string, options?: ToastOptions): string | number {
    return toast.loading(message, { ...defaultOptions, ...options });
  }

  /**
   * Update an existing toast
   * @param toastId - The ID of the toast to update
   * @param message - New message
   * @param type - Toast type
   */
  update(
    toastId: string | number,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ): void {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
    });
  }

  /**
   * Dismiss a specific toast
   * @param toastId - Optional toast ID. If not provided, dismisses all toasts
   */
  dismiss(toastId?: string | number): void {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  /**
   * Show success message for login
   */
  loginSuccess(userName?: string): void {
    this.success(
      `Welcome back${userName ? `, ${userName}` : ""}! Login successful.`
    );
  }

  /**
   * Show success message for create operations
   */
  createSuccess(entityName: string = "Item"): void {
    this.success(`${entityName} created successfully!`);
  }

  /**
   * Show success message for update operations
   */
  updateSuccess(entityName: string = "Item"): void {
    this.success(`${entityName} updated successfully!`);
  }

  /**
   * Show success message for delete operations
   */
  deleteSuccess(entityName: string = "Item"): void {
    this.success(`${entityName} deleted successfully!`);
  }

  /**
   * Show error message for failed operations
   */
  operationError(errorMessage: string, operation: string = "Operation"): void {
    this.error(`${operation} failed: ${errorMessage}`);
  }

  /**
   * Show error message for API errors
   */
  apiError(error: unknown): void {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (errorObj.message) {
        errorMessage = String(errorObj.message);
      }
    }

    this.error(errorMessage);
  }
}

// Export singleton instance
export const toastifyService = new ToastifyService();
export default toastifyService;
