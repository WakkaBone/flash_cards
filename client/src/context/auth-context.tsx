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

type SimpleCredentialsType = { username: string; password: string };
interface AuthContextType {
  isAuthenticated?: boolean;
  login: (credentials: SimpleCredentialsType) => void;
  logout: () => void;
  user: AuthUserModel | null;
}

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  user: null,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { login: loginMutation, logout: logoutMutation } = useAuth();
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
