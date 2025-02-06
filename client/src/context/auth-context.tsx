import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toastError } from "../utils/error-handler";
import { useAuth } from "../hooks";

type SimpleCredentialsType = { username: string; password: string };
interface AuthContextType {
  isAuthenticated?: boolean;
  login: (credentials: SimpleCredentialsType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { login: loginMutation, logout: logoutMutation, checkAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    //TODO check why this request is sent twice
    checkAuth({
      onSuccess: (data) => setIsAuthenticated(data.isSuccess),
      onError: () => setIsAuthenticated(false),
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
