import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotesList from './pages/NotesList.jsx';
import NoteEditor from './pages/NoteEditor.jsx';
import { useAuth } from './lib/AuthContext.jsx';
import { auth } from './lib/auth';

function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await auth.logout();
      setUser(null);
      navigate('/login');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold">Notes</Link>
      <nav className="space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user.name || user.mail}</span>
            <button className="px-3 py-1.5 border rounded" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  const { booting } = useAuth();
  if (booting) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
