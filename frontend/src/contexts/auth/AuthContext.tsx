/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useReducer, type Dispatch, type FC, type ReactNode } from "react";
import type { AuthState } from "./types";
import { authReducer } from "./reducers";
import { userService } from "../../services/userService";

export const AuthActionType = {
    INITIALIZE: 'INITIALIZE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',
} as const;

export type AuthActionType = typeof AuthActionType[keyof typeof AuthActionType];

export interface PayloadAction<T> {
    type: AuthActionType;
    payload: T;
}

export interface AuthContextType extends AuthState {
   dispatch: Dispatch<PayloadAction<Partial<AuthState>>>;
}

interface ChildrenProps {
    children: ReactNode;
}

const initialAuthState: AuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

const AuthContext = createContext<AuthContextType>({
    ...initialAuthState,
    dispatch: () => null,
});

const AuthProvider: FC<ChildrenProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    const initialize = (payload: Partial<AuthState>) => {
        dispatch({
            type: AuthActionType.INITIALIZE,
            payload: { ...payload, isInitialized: true }
        });
    };

    useEffect(() => {
        (async() => {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                return initialize({
                    isAuthenticated: false,
                    user: null,
                });
            }

            try {
                const user = await userService.getProfile();
                initialize({
                    isAuthenticated: true,
                    user,
                });
            } catch (error) {
                localStorage.removeItem('access_token');
                initialize({
                    isAuthenticated: false,
                    user: null,
                });
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
export default AuthProvider;
