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

type SimpleCredentialsType = { username: string; password: string };
interface AuthContextType {
  isAuthenticated?: boolean;
  login: (credentials: SimpleCredentialsType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { login: loginMutation, logout: logoutMutation } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    AuthService.checkAuth().then((data) =>
      setIsAuthenticated(!!data.isSuccess)
    );
  }, []);

  const login = (credentials: SimpleCredentialsType) => {
    loginMutation(credentials, {
      onSettled(data) {
        const isSuccess = !!data?.isSuccess;
        if (!isSuccess) {
          toastError(data?.error);
        } else {
          setIsAuthenticated(true);
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
        }
      },
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
