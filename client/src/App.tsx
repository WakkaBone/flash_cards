import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CardsPage } from "./pages/cards-page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AddCardPage } from "./pages/add-card-page";
import { PracticePage } from "./pages/practice-page";
import { Layout } from "./components/layout/layout";
import { AuthPage } from "./pages/auth-page";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-route/protected-route";
import { ROUTES } from "./constants";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <CardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.addCard}
                element={
                  <ProtectedRoute>
                    <AddCardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.practice}
                element={
                  <ProtectedRoute>
                    <PracticePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path={ROUTES.login} element={<AuthPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
