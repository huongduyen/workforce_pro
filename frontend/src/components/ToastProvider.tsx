import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastify.scss";

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * ToastProvider component - wraps the app with ToastContainer and toast styles
 * Add this to your app's root level (in App.tsx)
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </>
  );
};
