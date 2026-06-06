import { Routes, Route, Navigate } from 'react-router-dom';
import { useTeacher } from './context/TeacherContext';
import Layout from './components/Layout';
import TeacherSelect from './pages/TeacherSelect';
import ClassManage from './pages/ClassManage';
import EvalGrid from './pages/EvalGrid';

function ProtectedRoute({ children }) {
  const { teacher, loading } = useTeacher();

  if (loading) {
    return (
      <div className="page-container text-center" style={{ paddingTop: '20vh' }}>
        <div className="text-muted">Chargement...</div>
      </div>
    );
  }

  if (!teacher) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherSelect />} />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <Layout>
              <ClassManage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eval/:classId"
        element={
          <ProtectedRoute>
            <Layout>
              <EvalGrid />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
