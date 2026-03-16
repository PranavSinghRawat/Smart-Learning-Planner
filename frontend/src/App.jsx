import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Subjects from './pages/Subjects';

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-3xl">
    <p className="text-gray-500 text-xl font-medium">{title} Page Coming Soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="exams" element={<Exams />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="goals" element={<Placeholder title="Goals" />} />
          <Route path="plan/today" element={<Placeholder title="Today's Plan" />} />
          <Route path="progress" element={<Placeholder title="Progress" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
