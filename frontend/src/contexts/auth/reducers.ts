import type { AuthState } from "./types";
import type { PayloadAction } from "./AuthContext";

export const authReducer = (
  state: AuthState,
  action: PayloadAction<Partial<AuthState>>
): AuthState => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user || null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user || null,
      };
    default:
      return state;
  }
};
