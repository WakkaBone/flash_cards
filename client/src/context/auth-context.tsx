import {
  PropsWithChildren,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import js-cookie

type SimpleCredentialsType = { username: string; password: string };
interface AuthContextType {
  user?: string;
  isAuthenticated: boolean;
  login: (credentials: SimpleCredentialsType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<string | undefined>(
    Cookies.get(AUTH_TOKEN_KEY)
  );

  useEffect(() => {
    const authToken = Cookies.get(AUTH_TOKEN_KEY);
    if (authToken) setUser(authToken);
  }, []);

  const login = (credentials: SimpleCredentialsType) => {
    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    if (
      credentials.username === username &&
      credentials.password === password
    ) {
      setUser(username);
      Cookies.set(AUTH_TOKEN_KEY, username, { expires: 10 / 1440 });
    } else {
      toast("Invalid credentials", { type: "error" });
    }
  };

  const logout = () => {
    setUser(undefined);
    Cookies.remove(AUTH_TOKEN_KEY);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
