import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toastError } from "../utils/error-handler";
import { useAuth } from "../hooks";
import { AuthService } from "../services/auth-service";
import { AuthUserModel } from "../models/api";
import { Roles } from "../models/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { toast } from "react-toastify";

type SimpleCredentialsType = { username: string; password: string };
interface AuthContextType {
  isAuthenticated?: boolean;
  login: (credentials: SimpleCredentialsType) => void;
  logout: () => void;
  signup: (credentials: SimpleCredentialsType) => void;
  isLoading: boolean;
  user: AuthUserModel | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: undefined,
  login: () => {},
  isLoading: false,
  logout: () => {},
  signup: () => {},
  user: null,
  isAdmin: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const {
    login: loginMutation,
    loginMutation: { isPending: isLoggingIn },
    logout: logoutMutation,
    signup: signupMutation,
    signupMutation: { isPending: isSigningUp },
  } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  const [user, setUser] = useState<AuthUserModel | null>(null);

  useEffect(() => {
    AuthService.checkAuth().then((data) => {
      const isSuccess = !!data?.isSuccess;
      setIsAuthenticated(isSuccess);
      setUser(isSuccess ? data.data : undefined);
    });
  }, []);

  const login = (credentials: SimpleCredentialsType) => {
    loginMutation(credentials, {
      onSettled(data) {
        const isSuccess = !!data?.isSuccess;
        if (!isSuccess) {
          toastError(data?.error);
        } else {
          setIsAuthenticated(true);
          data.data && setUser(data.data);
        }
      },
    });
  };

  const logout = () => {
    logoutMutation({
      onSettled(data) {
        const isSuccess = !!data?.isSuccess;
        if (!isSuccess) {
          toastError(data?.error);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      },
    });
  };

  const signup = (credentials: SimpleCredentialsType) => {
    signupMutation(credentials, {
      onSettled(data) {
        const isSuccess = !!data?.isSuccess;
        if (!isSuccess) {
          toastError(data?.error);
        } else {
          toast(
            "User created successfully! You are being redirected to the login page",
            { type: "success" }
          );
          setTimeout(() => {
            navigate(ROUTES.login);
          }, 2000);
        }
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        signup,
        isLoading: isLoggingIn || isSigningUp,
        user,
        isAdmin: user?.role === Roles.admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
