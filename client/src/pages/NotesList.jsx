import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { notesApi } from '../api/notes';
import { fmtDate } from "../lib/date";


export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
  let mounted = true;
  setLoading(true);
  notesApi.list()
    .then(res => { if (mounted) setNotes(res.data || []); })
    .catch(e => { if (e.message.includes('Unauthorized')) navigate('/login'); else setErr(e.message); })
    .finally(() => mounted && setLoading(false));
  return () => { mounted = false; };
}, [navigate]);

  const filtered = useMemo(() => {
    let list = notes;
    const qq = q.trim().toLowerCase();
    if (qq) list = list.filter(n =>
      n.title.toLowerCase().includes(qq) || n.content.toLowerCase().includes(qq)
    );
    const tg = tag.trim().toLowerCase();
    if (tg) list = list.filter(n => (n.tags || []).map(t => t.toLowerCase()).includes(tg));
    return list;
  }, [notes, q, tag]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link to="/notes/new" className="px-3 py-1.5 border rounded">New Note</Link>
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Search title/content…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="w-48 border rounded p-2" placeholder="Filter tag…" value={tag} onChange={e=>setTag(e.target.value)} />
      </div>

      {loading && <div>Loading notes…</div>}
      {err && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm">{err}</div>}

      {!loading && filtered.length === 0 && (
        <div className="border rounded p-6 text-center text-gray-600">
          No notes yet.
          <div className="mt-2">
            <Link to="/notes/new" className="underline">Create your first note</Link>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {filtered.map((n) => {
          const noteId = n.id || n._id; // works whether API returns id or _id
          return (
            <li key={noteId || n.title} className="border rounded p-3 hover:bg-gray-50 transition">
              <div className="text-xs text-gray-500">Updated: {fmtDate(n.updatedAt)}</div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{n.title}</h2>
                {noteId ? (
                  <Link to={`/notes/${noteId}`} className="text-sm underline">
                    Edit
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">No id</span>
                )}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{n.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(n.tags || []).map((t) => (
                  <span key={t} className="text-xs border rounded px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
