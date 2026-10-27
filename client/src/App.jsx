
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import TripDetails from "./pages/TripDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public profile */}
        <Route
          path="/profile/:username"
          element={<PublicProfile />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/trips/new"
            element={<CreateTrip />}
          />

          <Route
            path="/trips/:id"
            element={<TripDetails />}
          />

          <Route
            path="/trips/:id/edit"
            element={<EditTrip />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
