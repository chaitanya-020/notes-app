import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesApi } from '../api/notes';

const toTags = (s) =>
  s.split(',').map(t => t.trim()).filter(Boolean);

const fromTags = (arr) =>
  (arr || []).join(', ');

export default function NoteEditor() {
  const { id } = useParams();          // if present => edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // inside NoteEditor component, after hooks:
  useEffect(() => {
    function onKey(e){ if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='s'){ e.preventDefault(); onSave(); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [title, content, tagsText]);  // keep it simple

  useEffect(() => {
  function onKey(e) {
    const k = e.key?.toLowerCase?.();
    if ((e.ctrlKey || e.metaKey) && k === 's') {
      e.preventDefault();
      onSave();
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
  }, [title, content, tagsText]);

  // Load existing note if editing
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    notesApi.get(id)
      .then(res => {
        if (!mounted) return;
        const n = res.data;
        setTitle(n.title || '');
        setContent(n.content || '');
        setTagsText(fromTags(n.tags));
      })
      .catch(e => setErr(e.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  async function onSave(e) {
    e?.preventDefault?.();
    setErr('');
    if (!title.trim() || !content.trim()) {
      setErr('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { title: title.trim(), content: content.trim(), tags: toTags(tagsText) };
      if (id) await notesApi.update(id, payload);
      else await notesApi.create(payload);
      navigate('/');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id) return;
    const ok = window.confirm('Delete this note?');
    if (!ok) return;
    setSaving(true);
    try {
      await notesApi.remove(id);
      navigate('/');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading note…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{id ? 'Edit Note' : 'New Note'}</h1>
      
      {id && <div className="text-xs text-gray-500">Last updated: {fmtDate(new Date().toISOString())}</div>}

      {err && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm">{err}</div>}

      <form onSubmit={onSave} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Title"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded p-2 min-h-[180px]"
          placeholder="Content (markdown ok)"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="tags (comma separated, e.g. work, ideas)"
          value={tagsText}
          onChange={e=>setTagsText(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-1.5 rounded border bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {id && (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="px-3 py-1.5 rounded border border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 active:scale-95 transition"
            >
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button type="button" onClick={() => navigate('/')} className="px-3 py-1.5 rounded border hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition"
  >Cancel</button>
        </div>
      </form>

      <p className="text-xs text-gray-500">
        Tip: tags are comma-separated. Example: <code>work, ideas</code>
      </p>
    </div>
  );
}
