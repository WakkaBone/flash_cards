import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";
import Cookies from "js-cookie";

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
    const authToken = Cookies.get("auth_token");
    setIsAuthenticated(!!authToken);
  }, []);

  const login = (credentials: SimpleCredentialsType) => {
    loginMutation(credentials, {
      onSettled(data) {
        const isSuccess = !!data?.isSuccess;
        if (!isSuccess) {
          toast("Failed to log in", { type: "error" });
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
          toast("Failed to log out", { type: "error" });
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
