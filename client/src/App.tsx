import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CardsPage } from "./pages/cards-page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AddCardPage } from "./pages/add-card-page";
import { PracticePage } from "./pages/practice-page";
import { Layout } from "./components/layout/layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<CardsPage />} />
            <Route path="/add" element={<AddCardPage />} />
            <Route path="/practice" element={<PracticePage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
