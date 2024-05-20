import { useAuth } from "./Auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DefaulLayout from "./layout/DefaulLayout";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<DefaulLayout />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
