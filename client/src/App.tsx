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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CategoriesPage } from "./pages/categories-page";
import { StatisticsPage } from "./pages/statistics-page";
import { UsersPage } from "./pages/users-page";
import { AdminRoute } from "./components/protected-route/admin-route";

const queryClient = new QueryClient();

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<CardsPage />} />
                <Route path={ROUTES.addCard} element={<AddCardPage />} />
                <Route path={ROUTES.practice} element={<PracticePage />} />
                <Route path={ROUTES.categories} element={<CategoriesPage />} />
                <Route path={ROUTES.statistics} element={<StatisticsPage />} />
                <Route
                  path={ROUTES.users}
                  element={
                    <AdminRoute>
                      <UsersPage />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route path={ROUTES.login} element={<AuthPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
