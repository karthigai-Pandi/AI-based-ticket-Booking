import { Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
