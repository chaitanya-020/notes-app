import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/auth';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Signup() {
  const [name, setName] = useState('User One');
  const [email, setEmail] = useState('u1@example.com');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await auth.signup({ name, email, password });
      setUser(res.data);
      navigate('/');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Signup</h1>
      {err && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full border rounded p-2">{loading ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  );
}
