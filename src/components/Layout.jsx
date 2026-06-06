import { Link, useNavigate } from 'react-router-dom';
import { useTeacher } from '../context/TeacherContext';

export default function Layout({ children }) {
  const { teacher, logout } = useTeacher();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = teacher?.name
    ? teacher.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <Link to="/classes" className="navbar-brand">
          <span className="navbar-brand-icon">📊</span>
          <span>EvalCECRL</span>
        </Link>

        <div className="navbar-actions">
          <Link to="/classes" className="btn btn-ghost btn-sm">
            Mes classes
          </Link>
          <div className="navbar-user">
            <div className="navbar-avatar">{initials}</div>
            <span>{teacher?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            title="Changer de profil"
          >
            ↩
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
